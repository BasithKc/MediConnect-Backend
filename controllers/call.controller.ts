import * as SendBirdCall from 'sendbird-calls'

// Initialize the SendBirdCall instance to use APIs in your app. 
SendBirdCall.init('5CBD323C-7BB0-469C-BECE-4589DBA1C3A9')
SendBirdCall.useMedia({audio: true, video: true})
