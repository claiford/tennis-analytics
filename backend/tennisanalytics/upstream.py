# from matplotlib import pyplot as plt
from tqdm import tqdm
import numpy as np
import pandas as pd
import math
import cv2
import os

import supervision
from supervision import ColorPalette, ColorLookup, Color
from supervision import Point
from supervision import VideoInfo, VideoSink, get_video_frames_generator
from supervision import plot_image
from supervision import mask_to_polygons, filter_polygons_by_area, draw_polygon
from supervision import Detections, BoundingBoxAnnotator, MaskAnnotator, LabelAnnotator
from supervision import PolygonZone, PolygonZoneAnnotator

import ultralytics
from roboflow import Roboflow

WEIGHTS = os.path.join(os.getcwd(), 'tennisanalytics/weights')
player_detection_model = ultralytics.YOLO(os.path.join(WEIGHTS, 'player_detection_model.pt'))
court_segmentation_model = ultralytics.YOLO(os.path.join(WEIGHTS, 'court_segmentation_model.pt'))

'''
██   ██ ███████ ██      ██████  ███████ ██████  ███████ 
██   ██ ██      ██      ██   ██ ██      ██   ██ ██      
███████ █████   ██      ██████  █████   ██████  ███████ 
██   ██ ██      ██      ██      ██      ██   ██      ██ 
██   ██ ███████ ███████ ██      ███████ ██   ██ ███████ 
                                                                                                                             
'''

def check_frame(player_detections, court_detections):
  return len(player_detections.class_id) == 2 and 1 in player_detections.class_id and 0 in player_detections.class_id and court_detections.mask is not None

def diagonal_distance(p1, p2):
  x1, y1 = p1
  x2, y2 = p2
  return math.sqrt((x2 - x1)**2 + (y2-y1)**2)

def get_court_corners(court_polygon, video_info):
  # video_info = VideoInfo.from_video_path(SOURCE_VIDEO_PATH)
  image_tl = (0, 0)
  image_tr = (video_info.width, 0)
  image_bl = (0, video_info.height)
  image_br = (video_info.width, video_info.height)

  y_top = video_info.height
  y_bottom = 0
  for vertex in court_polygon:
    if vertex[1] < y_top: y_top = vertex[1]
    if vertex[1] > y_bottom: y_bottom = vertex[1]

  # initialise court corners as opposite of image corners
  v1court_tl = image_br
  v1court_tr = image_bl
  v1court_bl = image_tr
  v1court_br = image_tl

  for vertex in court_polygon:
    # if (abs(vertex[1] - y_top) < 1):
    #   if vertex[0] < v1court_tl[0]: v1court_tl = vertex
    #   if vertex[0] > v1court_tr[0]: v1court_tr = vertex

    # if (abs(vertex[1] - y_bottom) < 1):
    #   if vertex[0] < v1court_tl[0]: v1court_bl = vertex
    #   if vertex[0] > v1court_tr[0]: v1court_br = vertexz

    if (vertex[1] < v1court_tl[1]) and vertex[0] < v1court_tl[0]:
      v1court_tl = vertex
    if vertex[1] < v1court_tr[1] and vertex[0] > v1court_tr[0]:
      v1court_tr = vertex
    if vertex[1] > v1court_bl[1] and vertex[0] < v1court_bl[0]:
      v1court_bl = vertex
    if vertex[1] > v1court_br[1] and vertex[0] > v1court_br[0]:
      v1court_br = vertex

  v1court_quad = np.array([v1court_tl, v1court_bl, v1court_br, v1court_tr])

  v2court_tl = image_br
  v2court_tr = image_bl
  v2court_bl = image_tr
  v2court_br = image_tl

  for vertex in np.flip(court_polygon, axis=0):
    if (vertex[1] < v2court_tl[1]) and vertex[0] < v2court_tl[0]:
      v2court_tl = vertex
    if vertex[1] < v2court_tr[1] and vertex[0] > v2court_tr[0]:
      v2court_tr = vertex
    if vertex[1] > v2court_bl[1] and vertex[0] < v2court_bl[0]:
      v2court_bl = vertex
    if vertex[1] > v2court_br[1] and vertex[0] > v2court_br[0]:
      v2court_br = vertex

  v2court_quad = np.array([v2court_tl, v2court_bl, v2court_br, v2court_tr])

  v3court_tl = image_br
  v3court_tr = image_bl
  v3court_bl = image_tr
  v3court_br = image_tl

  max_d1 = diagonal_distance(image_tl, image_tl)
  max_d2 = diagonal_distance(image_bl, image_bl)
  max_d3 = diagonal_distance(image_br, image_br)
  max_d4 = diagonal_distance(image_tr, image_tr)
  for vertex in court_polygon:
    d1 = diagonal_distance(image_tl, vertex)
    d2 = diagonal_distance(image_bl, vertex)
    d3 = diagonal_distance(image_br, vertex)
    d4 = diagonal_distance(image_tr, vertex)
    if d1 > max_d1:
      v3court_br = vertex
      max_d1 = d1
    if d2 > max_d2:
      v3court_tr = vertex
      max_d2 = d2
    if d3 > max_d3:
      v3court_tl = vertex
      max_d3 = d3
    if d4 > max_d4:
      v3court_bl = vertex
      max_d4 = d4

  v3court_quad = np.array([v3court_tl, v3court_bl, v3court_br, v3court_tr])

  image_corners = (image_tl, image_bl, image_br, image_tr)
  court_quad = np.empty((4, 2), dtype=np.int32)

  for i in range(4):
    # compare v1 and v2 court_quads
    v1 = diagonal_distance(image_corners[i], v1court_quad[i])
    v2 = diagonal_distance(image_corners[i], v2court_quad[i])
    v3 = diagonal_distance(image_corners[i], v3court_quad[i])

    if v1 <= v2 and v1 <= v3: court_quad[i] = v1court_quad[i]
    if v2 <= v1 and v2 <= v3: court_quad[i] = v2court_quad[i]
    if v3 <= v1 and v3 <= v2: court_quad[i] = v3court_quad[i]

  return court_quad, v1court_quad, v2court_quad, v3court_quad

def transform_player_positions(player_detections, court_quad, frame, draw=False):
  player_front_xyxy = player_detections.xyxy[0]
  player_front_x = (player_front_xyxy[0] + player_front_xyxy[2]) / 2
  player_front_y = player_front_xyxy[3]

  player_back_xyxy = player_detections.xyxy[1]
  player_back_x = (player_back_xyxy[0] + player_back_xyxy[2]) / 2
  player_back_y = player_back_xyxy[3]

  player_positions = [[player_front_x, player_front_y], [player_back_x, player_back_y]]

  rows, cols, ch = frame.shape

  pts1 = np.float32([court_quad[0],
                    court_quad[1],
                    court_quad[2],
                    court_quad[3]
                    ])

  x_buffer = 800
  y_buffer = 800

  pts2 = np.float32([[x_buffer, y_buffer],
                    [x_buffer, y_buffer + 1188 + 1188],
                    [x_buffer + 1096, y_buffer + 1188 + 1188],
                    [x_buffer + 1096, y_buffer]
                    ])

  M = cv2.getPerspectiveTransform(pts1, pts2)
  dst = cv2.warpPerspective(frame, M, (x_buffer + x_buffer + 1096, y_buffer + y_buffer + 1188 + 1188))


  points = np.array([[[player_front_x, player_front_y]], [[player_back_x,player_back_y]]])
  homg_points = np.array([[x, y, 1] for [[x, y]] in points]).T
  transf_homg_points = M.dot(homg_points)
  transf_homg_points /= transf_homg_points[2]
  transf_points = np.array([[[x,y]] for [x, y] in transf_homg_points[:2].T])
  player_front_new_x = transf_points[0][0][0]
  player_front_new_y = transf_points[0][0][1]
  player_back_new_x = transf_points[1][0][0]
  player_back_new_y = transf_points[1][0][1]
  player_positions_transformed=[[player_front_new_x, player_front_new_y], [player_back_new_x, player_back_new_y]]

  # if draw:
  #   plt.subplot(121)
  #   plt.imshow(frame)
  #   plt.plot(player_positions[0][0], player_positions[0][1], marker="o", markersize=5, markeredgecolor="red", markerfacecolor="yellow")
  #   plt.plot(player_positions[1][0], player_positions[1][1], marker="o", markersize=5, markeredgecolor="red", markerfacecolor="yellow")
  #   plt.title('Input')

  #   plt.subplot(122)
  #   plt.imshow(dst)
  #   plt.plot(player_positions_transformed[0][0], player_positions_transformed[0][1], marker="o", markersize=5, markeredgecolor="red", markerfacecolor="yellow")
  #   plt.plot(player_positions_transformed[1][0], player_positions_transformed[1][1], marker="o", markersize=5, markeredgecolor="red", markerfacecolor="yellow")
  #   plt.title('Output')

  #   plt.show()

  return player_positions_transformed

'''
███████ ██ ███    ██  ██████  ██      ███████     ███████ ██████   █████  ███    ███ ███████ 
██      ██ ████   ██ ██       ██      ██          ██      ██   ██ ██   ██ ████  ████ ██      
███████ ██ ██ ██  ██ ██   ███ ██      █████       █████   ██████  ███████ ██ ████ ██ █████   
     ██ ██ ██  ██ ██ ██    ██ ██      ██          ██      ██   ██ ██   ██ ██  ██  ██ ██      
███████ ██ ██   ████  ██████  ███████ ███████     ██      ██   ██ ██   ██ ██      ██ ███████ 
                                                                                             
'''
def process_frame(frame, video_info, draw=False):
  box_annotator = BoundingBoxAnnotator(thickness=4, color_lookup=ColorLookup.INDEX)
  label_annotator = LabelAnnotator(color_lookup=ColorLookup.INDEX)
  mask_annotator = MaskAnnotator(color_lookup=ColorLookup.INDEX)

  ## Player detection
  player_results = player_detection_model(frame)
  player_detections = Detections.from_ultralytics(player_results[0])
  player_detections = player_detections[player_detections.class_id <= 1]

  ## Court segmentation
  court_results = court_segmentation_model.predict(frame)
  court_detections = Detections.from_ultralytics(court_results[0])

  player_labels = [
      f"{player_detection_model.model.names[x[3]]} {x[2]:0.2f}"
      for x
      in player_detections
  ]
  court_labels = [
      f"{court_segmentation_model.model.names[x[3]]} {x[2]:0.2f}"
      for x
      in court_detections
  ]

  detections = Detections.merge([court_detections, player_detections, ])
  labels = court_labels + player_labels

  ## Annotate
  frame = box_annotator.annotate(scene=frame, detections=detections)
  frame = label_annotator.annotate(scene=frame, detections=detections, labels=labels)
  frame = mask_annotator.annotate(scene=frame, detections=court_detections)

  player_positions_transformed = None
  ## Run analysis if frame has 2 players (front, back) and 1 court with mask area > 1000
  if check_frame(player_detections, court_detections):
    court_polygon = filter_polygons_by_area(mask_to_polygons(court_detections.mask[0]), min_area=1000)[0]
    if court_polygon.any():
      court_quad, v1court_quad, v2court_quad, v3court_quad = get_court_corners(court_polygon, video_info)
      # frame = draw_polygon(scene=frame, polygon=v1court_quad, color=Color.from_hex('#000000'))
      # frame = draw_polygon(scene=frame, polygon=v2court_quad, color=Color.from_hex('#ffffff'))
      # frame = draw_polygon(scene=frame, polygon=v3court_quad, color=Color.from_hex('#123123'))
      frame = draw_polygon(scene=frame, polygon=court_quad, color=Color.from_hex('#ff00ff'))
      player_positions_transformed = transform_player_positions(player_detections, court_quad, frame, draw=draw)

  return frame, player_positions_transformed

'''
███████ ██    ██ ██      ██          ██    ██ ██ ██████  ███████  ██████  
██      ██    ██ ██      ██          ██    ██ ██ ██   ██ ██      ██    ██ 
█████   ██    ██ ██      ██          ██    ██ ██ ██   ██ █████   ██    ██ 
██      ██    ██ ██      ██           ██  ██  ██ ██   ██ ██      ██    ██ 
██       ██████  ███████ ███████       ████   ██ ██████  ███████  ██████  
                                                                          
'''

def process_video(position, source_path, target_path):
  ultralytics.checks()
  print("processing video")

  video_info = VideoInfo.from_video_path(source_path)
  generator = get_video_frames_generator(source_path)
  
  player_positions = []
  with VideoSink(target_path, video_info) as sink:
      for frame in tqdm(generator, total=video_info.total_frames):
          res_frame, player_positions_transformed = process_frame(frame, video_info)

          if player_positions_transformed is not None:
            if position == "front":
              player_positions.append(player_positions_transformed[0])
            elif position == "back":
              player_positions.append(player_positions_transformed[1])
          else:
            player_positions.append([None, None])

          sink.write_frame(res_frame)
  
  df = pd.DataFrame(
    data=player_positions,
    columns=['x', 'y']
  )
  
  json = df.to_json(orient='index')

  return (json, video_info)

if __name__ == "__main__":
  VIDEOS = os.path.join(os.getcwd(), 'videos')
  RESULTS = os.path.join(os.getcwd(), 'results')
  SOURCE_VIDEO_PATH = os.path.join(VIDEOS, 'clip_point1.mp4')
  TARGET_VIDEO_PATH = os.path.join(RESULTS, 'results_' + os.path.basename(SOURCE_VIDEO_PATH))
  
  process_video("front", SOURCE_VIDEO_PATH, TARGET_VIDEO_PATH)