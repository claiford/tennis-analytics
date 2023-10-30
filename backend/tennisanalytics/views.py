from django.http import JsonResponse, HttpResponse, HttpResponseRedirect, HttpResponseBadRequest, Http404
from django.shortcuts import render
from .models import Movie

from datetime import datetime
import os
import json
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv() 
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

def home(request):
    return JsonResponse({'test': "HOME"})

def openMatches(request):
    try:
        response = supabase.table('matches').select("*").eq('status', 'open').execute()
        return JsonResponse(response.data, safe=False)
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

            new_map = supabase.table('profile_match_mapping').insert(new_map).execute()
        
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
            new_match = supabase.table('matches').update({'player_count': increment}).eq('id', match_id).execute()

            new_map = {
                'profile_id': user_id,
                'match_id': match_id
            }

            new_map = supabase.table('profile_match_mapping').insert(new_map).execute()
        
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
            new_match = supabase.table('matches').update({'player_count': increment}).eq('id', match_id).execute()

            delete_map = supabase.table('profile_match_mapping').delete().eq('profile_id', user_id).eq('match_id', match_id).execute()
        
        return HttpResponse(status=200)
    except Exception as e:
        print(e)
        return HttpResponseBadRequest("Bad Request")

def detail(request, id):
    data = Movie.objects.get(pk=id)
    return render(request, 'movies/detail.html', {'movie': data})

def add(request):
    title = request.POST.get('title')
    year = request.POST.get('year')

    if title and year:
        movie = Movie(title=title, year=year)
        movie.save()
        return HttpResponseRedirect('/movies')

    return render(request, 'movies/add.html')

def delete(request, id):
    try:
        movie = Movie.objects.get(pk=id)
    except:
        raise Http404("Movie does not exist!")
    movie.delete()
    return HttpResponseRedirect('/movies')