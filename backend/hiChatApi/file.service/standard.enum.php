<?php
        enum Standard: string{
            case SERVER_ADDRESS = 'localhost:3306';
            case API_PORT = 'http://localhost:3307/';
            case FOLDER_ROOT_IMG = 'user-api/';
                
            case PUBLICATION_VIDEO = 'PUBLICATION_VIDEO';
            case PUBLICATION_IMAGE = 'PUBLICATION_IMAGE';
            case PUBLICATION_VIDEO_EXTENSION = '.mp4';
            case PUBLICATION_IMAGE_EXTENSION = '.png';

            case DEFAULT_FILE_PATH_DATA = '../API-ADMIN/data/';
            case DEFAULT_FILE_PATH_ERROR_LOG = '../API-ADMIN/ERROR_LOG/';
            case FILE_NOTIF_STORE = 'NotificationStore.txt';
            case FILE_USERS_ONLINE = 'UsersOnline.txt';
            case FILE_MSG_STORE = 'MessageStore.txt';
        }
  
?>