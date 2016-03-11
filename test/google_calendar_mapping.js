module.exports = {
  "kind": {
    type: String,
    default: "calendar#event"
  },
  "etag": String,
  "id": String,
  "status": String,
  "htmlLink": String,
  "created": {
    type: Date,
    default: Date
  },
  "updated": {
    type: Date,
    default: Date
  },
  "summary": String,
  "description": String,
  "location": String,
  "colorId": String,
  "creator": {
    "id": String,
    "email": String,
    "displayName": String,
    "self": Boolean
  },
  "organizer": {
    "id": String,
    "email": String,
    "displayName": String,
    "self": Boolean
  },
  "start": {
    "date": Date,
    "dateTime": Date,
    "timeZone": String
  },
  "end": {
    "date": Date,
    "dateTime": Date,
    "timeZone": String
  },
  "endTimeUnspecified": Boolean,
  "recurrence": [
    String
  ],
  "recurringEventId": String,
  "originalStartTime": {
    "date": Date,
    "dateTime": Date,
    "timeZone": String
  },
  "transparency": String,
  "visibility": String,
  "iCalUID": String,
  "sequence": Number,
  "attendees": [
    {
      "id": String,
      "email": String,
      "displayName": String,
      "organizer": Boolean,
      "self": Boolean,
      "resource": Boolean,
      "optional": Boolean,
      "responseStatus": String,
      "comment": String,
      "additionalGuests": Number
    }
  ],
  "attendeesOmitted": Boolean,
  "extendedProperties": {
    "private": { },
    "shared": { }
  },
  "hangoutLink": String,
  "gadget": {
    "type": String,
    "title": String,
    "link": String,
    "iconLink": String,
    "width": Number,
    "height": Number,
    "display": String,
    "preferences": { }
  },
  "anyoneCanAddSelf": Boolean,
  "guestsCanInviteOthers": Boolean,
  "guestsCanModify": Boolean,
  "guestsCanSeeOtherGuests": Boolean,
  "privateCopy": Boolean,
  "locked": Boolean,
  "reminders": {
    "useDefault": Boolean,
    "overrides": [
      {
        "method": String,
        "minutes": Number
      }
    ]
  },
  "source": {
    "url": String,
    "title": String
  },
  "attachments": [
    {
      "fileUrl": String,
      "title": String,
      "mimeType": String,
      "iconLink": String,
      "fileId": String
    }
  ]
}
