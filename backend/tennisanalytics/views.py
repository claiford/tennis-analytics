from django.http import JsonResponse, HttpResponse, HttpResponseRedirect, HttpResponseBadRequest, Http404
from django.shortcuts import render
from .models import Movie

from tempfile import NamedTemporaryFile
from datetime import datetime
import os
import json
from supabase import create_client, Client
from dotenv import load_dotenv
import cv2

from .upstream import process_video

load_dotenv() 
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

def home(request):
    return JsonResponse({'test': "HOME"})

def user(requst):
    try:
        profiles = supabase.table('profiles').select("*").execute()
        return JsonResponse({'profiles': profiles.data}, safe=False)
    except Exception as e:
        print(e)
        return HttpResponseBadRequest("Bad Request")

def completedMatches(request):
    try:
        matches = supabase.table('matches').select("*").eq('status', 'completed').execute()
        mappings = supabase.table('profile_match_mapping').select("*").execute()
        return JsonResponse({
            'matches': matches.data,
            'mapping': mappings.data
        }, safe=False)
    except Exception as e:
        print(e)
        return HttpResponseBadRequest("Bad Request")

def matches(request):
    try:
        matches = supabase.table('matches').select("*").execute()
        mappings = supabase.table('profile_match_mapping').select("*").execute()
        
        return JsonResponse({
            'matches': matches.data,
            'mapping': mappings.data
        }, safe=False)
    except Exception as e:
        print(e)
        return HttpResponseBadRequest("Bad Request")

def createMatch(request):
    try:
        if request.method == "POST":
            body = json.loads(request.body)
            new_match = supabase.table('matches').insert(body['data']).execute()

            new_map = {
                'profile_id': body['user_id'],
                'match_id': new_match.data[0]['id']
            }

            creted_map = supabase.table('profile_match_mapping').insert(new_map).execute()
        
        return HttpResponse(status=200)
    except Exception as e:
        print(e)
        return HttpResponseBadRequest("Bad Request")

def joinMatch(request):
    try:
        if request.method == "PUT":
            user_id, match_id = json.loads(request.body).values()

            match = supabase.table('matches').select("*").eq('id', match_id).execute()
            increment = match.data[0]['player_count'] + 1
            updated_match = supabase.table('matches').update({'player_count': increment}).eq('id', match_id).execute()

            new_map = {
                'profile_id': user_id,
                'match_id': match_id
            }

            created_map = supabase.table('profile_match_mapping').insert(new_map).execute()
        
        return HttpResponse(status=200)
    except Exception as e:
        print(e)
        return HttpResponseBadRequest("Bad Request")

def leaveMatch(request):
    try:
        if request.method == "PUT":
            user_id, match_id = json.loads(request.body).values()

            match = supabase.table('matches').select("*").eq('id', match_id).execute()
            increment = match.data[0]['player_count'] - 1
            updated_match = supabase.table('matches').update({'player_count': increment}).eq('id', match_id).execute()

            deleted_map = supabase.table('profile_match_mapping').delete().eq('profile_id', user_id).eq('match_id', match_id).execute()
        
        return HttpResponse(status=200)
    except Exception as e:
        print(e)
        return HttpResponseBadRequest("Bad Request")

def completeMatch(request):
    try:
        if request.method == "PUT":
            user_id, match_id = json.loads(request.body).values()

            updated_match = supabase.table('matches').update({'status': 'completed'}).eq('id', match_id).execute()
        
        return HttpResponse(status=200)
    except Exception as e:
        print(e)
        return HttpResponseBadRequest("Bad Request")

def diagnostics(request):
    try:
        diagnostics = supabase.table('diagnostics').select("*").execute()
        
        return JsonResponse({'diagnostics': diagnostics.data}, safe=False)
    except Exception as e:
        print(e)
        return HttpResponseBadRequest("Bad Request")

def createDiagnostic(request):
    try:
        if request.method == "POST":
            video = request.FILES['video']

            position = request.POST['position']
            source_path = video.temporary_file_path()

            # upload raw video
            supabase_raw = f"raw/{video.name}"
            try:
                with open(source_path, 'rb') as f:
                    supabase.storage.from_("videos").upload(file=f,path=supabase_raw, file_options={"content-type": "video/h264"})
            except Exception as e:
                print("ERROR HERE", e)
                if e.args[0]['error'] != 'Duplicate': raise e
            finally:
                raw_url = supabase.storage.from_('videos').get_public_url(supabase_raw)

            # create empty diagnostic
            new_diagnostic = {
                'status': 'loading',
                'profile_id': request.POST['user_id'],
                'match_id': request.POST['match_id'],
                'title': request.POST['title'],
            }
            created_diagnostic = supabase.table('diagnostics').insert(new_diagnostic).execute()
            new_diagnostic_id = created_diagnostic.data[0]['id']

            # create temp file and start processing
            with NamedTemporaryFile(mode='w+b', suffix='.webm') as target_file:
                target_path = target_file.name
                # target_path = os.path.join(os.getcwd(), 'result.webM')
                print("TARGET PATH", target_path)

                json, video_info = process_video(position, source_path, target_path)
                print("JSON", json)
                # upload processed video
                now = datetime.now()
                date_time = now.strftime("%m-%d-%Y_%H-%M-%S")
                supabase_processed = f"processed/{date_time}_{video.name}"
                
                try:
                    with open(target_path, 'rb') as f:
                        supabase.storage.from_("videos").upload(file=f,path=supabase_processed, file_options={"content-type": "video/mp4"})
                except Exception as e:
                    if e.args[0]['error'] != 'Duplicate': raise e
                finally:
                    processed_url = supabase.storage.from_('videos').get_public_url(supabase_processed)

            print("RAW", raw_url)
            print("PROCESSED", processed_url)

            new_diagnostic = {
                'status': 'loaded',
                'position': position,
                'xy': json,
                'fps': video_info.fps,
                'total_frames': video_info.total_frames,
                'raw_video_url': raw_url,
                'processed_video_url': processed_url
            }

            print(new_diagnostic)

            updated_diagnostic = supabase.table('diagnostics').update(new_diagnostic).eq('id', new_diagnostic_id).execute()

        return HttpResponse(status=200)
    except Exception as e:
        print(e)
        return HttpResponseBadRequest("Bad Request")

def editDiagnosticNotes(request):
    try:
        body = json.loads(request.body)
        # diagnostics = supabase.table('diagnostics').select("*").execute()
        updated_diagnostic = supabase.table('diagnostics').update({'notes': body['notes']}).eq('id', body['diagnostic_id']).execute()
        
        return HttpResponse(status=200)
    except Exception as e:
        print(e)
        return HttpResponseBadRequest("Bad Request")