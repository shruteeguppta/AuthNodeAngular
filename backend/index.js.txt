const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const ExcelJS = require('exceljs');

const app = express();

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:4200', // Allow requests from this origin
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type,Authorization'
}));

app.use(bodyParser.json()); // Parse JSON bodies

const PORT = process.env.PORT || 3000;

// Temporary user storage (in-memory, for learning purposes)
const users = [];

// Data for the new endpoint
const eventData = {
  pagecount: 3,
  totalevents: 22,
  events: [
    {
      eventid: 1,
      clientid: 1,
      goodafter: "2024-01-02T12:05:00-08:00",
      description: "ABC",
      displaytimezonecd: "America",
      eventtype: "webpage",
      createdby: "A Wu",
      createtimestamp: "2024-01-02T12:04:33-08:00",
      localelanguagecd: "en",
      lastmodified: "2024-04-23T13:14:43-07:00",
      livestart: "2024-01-02T12:05:00-08:00",
      liveend: "2024-01-02T12:05:00-08:00",
      eventprofile: "Stonehenge Profile (1200)",
      streamtype: "whitepaper",
      tags: ["AFO Tech Sales"],
      contenttype: "webpage",
      lastupdated: "2024-04-19T14:18:54-07:00",
      media: {
        videos: [
          "http://pm.on24.com/media/cv/events/video_library/client/https://www.agilent.com/cs/library/flyers/public/flyer-sureselect-cd-cibermedheme-5994-6851en-agilent.pdf"
        ]
      }
    },
    {
      eventid: 1,
      clientid: 1,
      goodafter: "2024-01-02T12:05:00-08:00",
      description: "ABC",
      displaytimezonecd: "America",
      eventtype: "webpage",
      createdby: "A Wu",
      createtimestamp: "2024-01-02T12:04:33-08:00",
      localelanguagecd: "en",
      lastmodified: "2024-04-23T13:14:43-07:00",
      livestart: "2024-01-02T12:05:00-08:00",
      liveend: "2024-01-02T12:05:00-08:00",
      eventprofile: "Stonehenge Profile (1200)",
      streamtype: "whitepaper",
      tags: ["AFO Tech Sales"],
      contenttype: "webpage",
      lastupdated: "2024-04-19T14:18:54-07:00",
      media: {
        videos: [
          "http://pm.on24.com/media/cv/events/video_library/client/https://www.agilent.com/cs/library/flyers/public/flyer-sureselect-cd-cibermedheme-5994-6851en-agilent.pdf"
        ]
      }
    },
    {
      eventid: 1,
      clientid: 1,
      goodafter: "2024-01-02T12:05:00-08:00",
      description: "ABC",
      displaytimezonecd: "America",
      eventtype: "webpage",
      createdby: "A Wu",
      createtimestamp: "2024-01-02T12:04:33-08:00",
      localelanguagecd: "en",
      lastmodified: "2024-04-23T13:14:43-07:00",
      livestart: "2024-01-02T12:05:00-08:00",
      liveend: "2024-01-02T12:05:00-08:00",
      eventprofile: "Stonehenge Profile (1200)",
      streamtype: "whitepaper",
      tags: ["AFO Tech Sales"],
      contenttype: "webpage",
      lastupdated: "2024-04-19T14:18:54-07:00",
      media: {
        videos: [
          "http://pm.on24.com/media/cv/events/video_library/client/https://www.agilent.com/cs/library/flyers/public/flyer-sureselect-cd-cibermedheme-5994-6851en-agilent.pdf"
        ]
      }
    },
    {
      eventid: 2,
      clientid: 2,
      goodafter: "2024-01-03T08:55:00-08:00",
      description: "Collection",
      displaytimezonecd: "Los_Angeles",
      eventtype: "webpage",
      createdby: "Shuang Wu",
      createtimestamp: "2024-01-03T08:54:59-08:00",
      localelanguagecd: "en",
      lastmodified: "2024-01-26T09:24:33-08:00",
      livestart: "2024-01-03T08:55:00-08:00",
      liveend: "2024-01-03T08:55:00-08:00",
      eventprofile: "Stonehenge Profile (1200)",
      streamtype: "whitepaper",
      tags: ["AFO Tech Sales"],
      contenttype: "webpage",
      lastupdated: "2024-01-22T09:39:38-08:00",
      media: {
        videos: [
          "http://pm.on24.com/media/cv/events/video_library/client/https://www.agilent.com/cs/library/citations/brochure-research-citation-microarray-ngs-solutions-5994-2946EN-agilent.pdf"
        ]
      }
    },
    {
      eventid: 3,
      clientid: 3,
      goodafter: "2024-01-02T12:05:00-08:00",
      description: "Agilent SureSelect CD CiberMed Heme and Heme+HiRes (Control) Panels",
      displaytimezonecd: "America/Los_Angeles",
      eventtype: "webpage",
      createdby: "Shuang Wu",
      createtimestamp: "2024-01-02T12:04:33-08:00",
      localelanguagecd: "en",
      lastmodified: "2024-04-23T13:14:43-07:00",
      livestart: "2024-01-02T12:05:00-08:00",
      liveend: "2024-01-02T12:05:00-08:00",
      eventprofile: "Stonehenge Profile (1200)",
      streamtype: "whitepaper",
      tags: ["AFO Tech Sales"],
      contenttype: "webpage",
      lastupdated: "2024-04-19T14:18:54-07:00",
      media: {
        videos: [
          "http://pm.on24.com/media/cv/events/video_library/client/https://www.agilent.com/cs/library/flyers/public/flyer-sureselect-cd-cibermedheme-5994-6851en-agilent.pdf"
        ]
      }
    },
    {
      eventid: 4,
      clientid: 4,
      goodafter: "2024-01-03T08:55:00-08:00",
      description: "Agilent Microarray and NGS Solutions Research Citation Collection",
      displaytimezonecd: "America/Los_Angeles",
      eventtype: "webpage",
      createdby: "Shuang Wu",
      createtimestamp: "2024-01-03T08:54:59-08:00",
      localelanguagecd: "en",
      lastmodified: "2024-01-26T09:24:33-08:00",
      livestart: "2024-01-03T08:55:00-08:00",
      liveend: "2024-01-03T08:55:00-08:00",
      eventprofile: "Stonehenge Profile (1200)",
      streamtype: "whitepaper",
      tags: ["AFO Tech Sales"],
      contenttype: "webpage",
      lastupdated: "2024-01-22T09:39:38-08:00",
      media: {
        videos: [
          "http://pm.on24.com/media/cv/events/video_library/client/https://www.agilent.com/cs/library/citations/brochure-research-citation-microarray-ngs-solutions-5994-2946EN-agilent.pdf"
        ]
      }
    },
    {
      eventid: 5,
      clientid: 5,
      goodafter: "2024-01-02T12:05:00-08:00",
      description: "Agilent SureSelect CD CiberMed Heme and Heme+HiRes (Control) Panels",
      displaytimezonecd: "America/Los_Angeles",
      eventtype: "webpage",
      createdby: "Shuang Wu",
      createtimestamp: "2024-01-02T12:04:33-08:00",
      localelanguagecd: "en",
      lastmodified: "2024-04-23T13:14:43-07:00",
      livestart: "2024-01-02T12:05:00-08:00",
      liveend: "2024-01-02T12:05:00-08:00",
      eventprofile: "Stonehenge Profile (1200)",
      streamtype: "whitepaper",
      tags: ["AFO Tech Sales"],
      contenttype: "webpage",
      lastupdated: "2024-04-19T14:18:54-07:00",
      media: {
        videos: [
          "http://pm.on24.com/media/cv/events/video_library/client/https://www.agilent.com/cs/library/flyers/public/flyer-sureselect-cd-cibermedheme-5994-6851en-agilent.pdf"
        ]
      }
    },
    {
      eventid: 6,
      clientid: 6,
      goodafter: "2024-01-03T08:55:00-08:00",
      description: "Agilent Microarray and NGS Solutions Research Citation Collection",
      displaytimezonecd: "America/Los_Angeles",
      eventtype: "webpage",
      createdby: "Shuang Wu",
      createtimestamp: "2024-01-03T08:54:59-08:00",
      localelanguagecd: "en",
      lastmodified: "2024-01-26T09:24:33-08:00",
      livestart: "2024-01-03T08:55:00-08:00",
      liveend: "2024-01-03T08:55:00-08:00",
      eventprofile: "Stonehenge Profile (1200)",
      streamtype: "whitepaper",
      tags: ["AFO Tech Sales"],
      contenttype: "webpage",
      lastupdated: "2024-01-22T09:39:38-08:00",
      media: {
        videos: [
          "http://pm.on24.com/media/cv/events/video_library/client/https://www.agilent.com/cs/library/citations/brochure-research-citation-microarray-ngs-solutions-5994-2946EN-agilent.pdf"
        ]
      }
    },
    {
      eventid: 7,
      clientid: 7,
      goodafter: "2024-01-02T12:05:00-08:00",
      description: "Agilent SureSelect CD CiberMed Heme and Heme+HiRes (Control) Panels",
      displaytimezonecd: "America/Los_Angeles",
      eventtype: "webpage",
      createdby: "Shuang Wu",
      createtimestamp: "2024-01-02T12:04:33-08:00",
      localelanguagecd: "en",
      lastmodified: "2024-04-23T13:14:43-07:00",
      livestart: "2024-01-02T12:05:00-08:00",
      liveend: "2024-01-02T12:05:00-08:00",
      eventprofile: "Stonehenge Profile (1200)",
      streamtype: "whitepaper",
      tags: ["AFO Tech Sales"],
      contenttype: "webpage",
      lastupdated: "2024-04-19T14:18:54-07:00",
      media: {
        videos: [
          "http://pm.on24.com/media/cv/events/video_library/client/https://www.agilent.com/cs/library/flyers/public/flyer-sureselect-cd-cibermedheme-5994-6851en-agilent.pdf"
        ]
      }
    },
    {
      eventid: 8,
      clientid: 8,
      goodafter: "2024-01-03T08:55:00-08:00",
      description: "Agilent Microarray and NGS Solutions Research Citation Collection",
      displaytimezonecd: "America/Los_Angeles",
      eventtype: "webpage",
      createdby: "Shuang Wu",
      createtimestamp: "2024-01-03T08:54:59-08:00",
      localelanguagecd: "en",
      lastmodified: "2024-01-26T09:24:33-08:00",
      livestart: "2024-01-03T08:55:00-08:00",
      liveend: "2024-01-03T08:55:00-08:00",
      eventprofile: "Stonehenge Profile (1200)",
      streamtype: "whitepaper",
      tags: ["AFO Tech Sales"],
      contenttype: "webpage",
      lastupdated: "2024-01-22T09:39:38-08:00",
      media: {
        videos: [
          "http://pm.on24.com/media/cv/events/video_library/client/https://www.agilent.com/cs/library/citations/brochure-research-citation-microarray-ngs-solutions-5994-2946EN-agilent.pdf"
        ]
      }
    },
    {
      eventid: 9,
      clientid: 9,
      goodafter: "2024-01-02T12:05:00-08:00",
      description: "Agilent SureSelect CD CiberMed Heme and Heme+HiRes (Control) Panels",
      displaytimezonecd: "America/Los_Angeles",
      eventtype: "webpage",
      createdby: "Shuang Wu",
      createtimestamp: "2024-01-02T12:04:33-08:00",
      localelanguagecd: "en",
      lastmodified: "2024-04-23T13:14:43-07:00",
      livestart: "2024-01-02T12:05:00-08:00",
      liveend: "2024-01-02T12:05:00-08:00",
      eventprofile: "Stonehenge Profile (1200)",
      streamtype: "whitepaper",
      tags: ["AFO Tech Sales"],
      contenttype: "webpage",
      lastupdated: "2024-04-19T14:18:54-07:00",
      media: {
        videos: [
          "http://pm.on24.com/media/cv/events/video_library/client/https://www.agilent.com/cs/library/flyers/public/flyer-sureselect-cd-cibermedheme-5994-6851en-agilent.pdf"
        ]
      }
    },
    {
      eventid: 10,
      clientid: 10,
      goodafter: "2024-01-03T08:55:00-08:00",
      description: "Agilent Microarray and NGS Solutions Research Citation Collection",
      displaytimezonecd: "America/Los_Angeles",
      eventtype: "webpage",
      createdby: "Shuang Wu",
      createtimestamp: "2024-01-03T08:54:59-08:00",
      localelanguagecd: "en",
      lastmodified: "2024-01-26T09:24:33-08:00",
      livestart: "2024-01-03T08:55:00-08:00",
      liveend: "2024-01-03T08:55:00-08:00",
      eventprofile: "Stonehenge Profile (1200)",
      streamtype: "whitepaper",
      tags: ["AFO Tech Sales"],
      contenttype: "webpage",
      lastupdated: "2024-01-22T09:39:38-08:00",
      media: {
        videos: [
          "http://pm.on24.com/media/cv/events/video_library/client/https://www.agilent.com/cs/library/citations/brochure-research-citation-microarray-ngs-solutions-5994-2946EN-agilent.pdf"
        ]
      }
    },
    {
      eventid: 11,
      clientid: 11,
      goodafter: "2024-01-02T12:05:00-08:00",
      description: "Agilent SureSelect CD CiberMed Heme and Heme+HiRes (Control) Panels",
      displaytimezonecd: "America/Los_Angeles",
      eventtype: "webpage",
      createdby: "Shuang Wu",
      createtimestamp: "2024-01-02T12:04:33-08:00",
      localelanguagecd: "en",
      lastmodified: "2024-04-23T13:14:43-07:00",
      livestart: "2024-01-02T12:05:00-08:00",
      liveend: "2024-01-02T12:05:00-08:00",
      eventprofile: "Stonehenge Profile (1200)",
      streamtype: "whitepaper",
      tags: ["AFO Tech Sales"],
      contenttype: "webpage",
      lastupdated: "2024-04-19T14:18:54-07:00",
      media: {
        videos: [
          "http://pm.on24.com/media/cv/events/video_library/client/https://www.agilent.com/cs/library/flyers/public/flyer-sureselect-cd-cibermedheme-5994-6851en-agilent.pdf"
        ]
      }
    },
    {
      eventid: 12,
      clientid: 12,
      goodafter: "2024-01-03T08:55:00-08:00",
      description: "Agilent Microarray and NGS Solutions Research Citation Collection",
      displaytimezonecd: "America/Los_Angeles",
      eventtype: "webpage",
      createdby: "Shuang Wu",
      createtimestamp: "2024-01-03T08:54:59-08:00",
      localelanguagecd: "en",
      lastmodified: "2024-01-26T09:24:33-08:00",
      livestart: "2024-01-03T08:55:00-08:00",
      liveend: "2024-01-03T08:55:00-08:00",
      eventprofile: "Stonehenge Profile (1200)",
      streamtype: "whitepaper",
      tags: ["AFO Tech Sales"],
      contenttype: "webpage",
      lastupdated: "2024-01-22T09:39:38-08:00",
      media: {
        videos: [
          "http://pm.on24.com/media/cv/events/video_library/client/https://www.agilent.com/cs/library/citations/brochure-research-citation-microarray-ngs-solutions-5994-2946EN-agilent.pdf"
        ]
      }
    },
    {
      eventid: 13,
      clientid: 13,
      goodafter: "2024-01-02T12:05:00-08:00",
      description: "Agilent SureSelect CD CiberMed Heme and Heme+HiRes (Control) Panels",
      displaytimezonecd: "America/Los_Angeles",
      eventtype: "webpage",
      createdby: "Shuang Wu",
      createtimestamp: "2024-01-02T12:04:33-08:00",
      localelanguagecd: "en",
      lastmodified: "2024-04-23T13:14:43-07:00",
      livestart: "2024-01-02T12:05:00-08:00",
      liveend: "2024-01-02T12:05:00-08:00",
      eventprofile: "Stonehenge Profile (1200)",
      streamtype: "whitepaper",
      tags: ["AFO Tech Sales"],
      contenttype: "webpage",
      lastupdated: "2024-04-19T14:18:54-07:00",
      media: {
        videos: [
          "http://pm.on24.com/media/cv/events/video_library/client/https://www.agilent.com/cs/library/flyers/public/flyer-sureselect-cd-cibermedheme-5994-6851en-agilent.pdf"
        ]
      }
    },
    {
      eventid: 14,
      clientid: 14,
      goodafter: "2024-01-03T08:55:00-08:00",
      description: "Agilent Microarray and NGS Solutions Research Citation Collection",
      displaytimezonecd: "America/Los_Angeles",
      eventtype: "webpage",
      createdby: "Shuang Wu",
      createtimestamp: "2024-01-03T08:54:59-08:00",
      localelanguagecd: "en",
      lastmodified: "2024-01-26T09:24:33-08:00",
      livestart: "2024-01-03T08:55:00-08:00",
      liveend: "2024-01-03T08:55:00-08:00",
      eventprofile: "Stonehenge Profile (1200)",
      streamtype: "whitepaper",
      tags: ["AFO Tech Sales"],
      contenttype: "webpage",
      lastupdated: "2024-01-22T09:39:38-08:00",
      media: {
        videos: [
          "http://pm.on24.com/media/cv/events/video_library/client/https://www.agilent.com/cs/library/citations/brochure-research-citation-microarray-ngs-solutions-5994-2946EN-agilent.pdf"
        ]
      }
    },
    {
      eventid: 15,
      clientid: 15,
      goodafter: "2024-01-02T12:05:00-08:00",
      description: "Agilent SureSelect CD CiberMed Heme and Heme+HiRes (Control) Panels",
      displaytimezonecd: "America/Los_Angeles",
      eventtype: "webpage",
      createdby: "Shuang Wu",
      createtimestamp: "2024-01-02T12:04:33-08:00",
      localelanguagecd: "en",
      lastmodified: "2024-04-23T13:14:43-07:00",
      livestart: "2024-01-02T12:05:00-08:00",
      liveend: "2024-01-02T12:05:00-08:00",
      eventprofile: "Stonehenge Profile (1200)",
      streamtype: "whitepaper",
      tags: ["AFO Tech Sales"],
      contenttype: "webpage",
      lastupdated: "2024-04-19T14:18:54-07:00",
      media: {
        videos: [
          "http://pm.on24.com/media/cv/events/video_library/client/https://www.agilent.com/cs/library/flyers/public/flyer-sureselect-cd-cibermedheme-5994-6851en-agilent.pdf"
        ]
      }
    },
    {
      eventid: 16,
      clientid: 16,
      goodafter: "2024-01-03T08:55:00-08:00",
      description: "Agilent Microarray and NGS Solutions Research Citation Collection",
      displaytimezonecd: "America/Los_Angeles",
      eventtype: "webpage",
      createdby: "Shuang Wu",
      createtimestamp: "2024-01-03T08:54:59-08:00",
      localelanguagecd: "en",
      lastmodified: "2024-01-26T09:24:33-08:00",
      livestart: "2024-01-03T08:55:00-08:00",
      liveend: "2024-01-03T08:55:00-08:00",
      eventprofile: "Stonehenge Profile (1200)",
      streamtype: "whitepaper",
      tags: ["AFO Tech Sales"],
      contenttype: "webpage",
      lastupdated: "2024-01-22T09:39:38-08:00",
      media: {
        videos: [
          "http://pm.on24.com/media/cv/events/video_library/client/https://www.agilent.com/cs/library/citations/brochure-research-citation-microarray-ngs-solutions-5994-2946EN-agilent.pdf"
        ]
      }
    },
    {
      eventid: 17,
      clientid: 17,
      goodafter: "2024-01-02T12:05:00-08:00",
      description: "Agilent SureSelect CD CiberMed Heme and Heme+HiRes (Control) Panels",
      displaytimezonecd: "America/Los_Angeles",
      eventtype: "webpage",
      createdby: "Shuang Wu",
      createtimestamp: "2024-01-02T12:04:33-08:00",
      localelanguagecd: "en",
      lastmodified: "2024-04-23T13:14:43-07:00",
      livestart: "2024-01-02T12:05:00-08:00",
      liveend: "2024-01-02T12:05:00-08:00",
      eventprofile: "Stonehenge Profile (1200)",
      streamtype: "whitepaper",
      tags: ["AFO Tech Sales"],
      contenttype: "webpage",
      lastupdated: "2024-04-19T14:18:54-07:00",
      media: {
        videos: [
          "http://pm.on24.com/media/cv/events/video_library/client/https://www.agilent.com/cs/library/flyers/public/flyer-sureselect-cd-cibermedheme-5994-6851en-agilent.pdf"
        ]
      }
    },
    {
      eventid: 18,
      clientid: 18,
      goodafter: "2024-01-03T08:55:00-08:00",
      description: "Agilent Microarray and NGS Solutions Research Citation Collection",
      displaytimezonecd: "America/Los_Angeles",
      eventtype: "webpage",
      createdby: "Shuang Wu",
      createtimestamp: "2024-01-03T08:54:59-08:00",
      localelanguagecd: "en",
      lastmodified: "2024-01-26T09:24:33-08:00",
      livestart: "2024-01-03T08:55:00-08:00",
      liveend: "2024-01-03T08:55:00-08:00",
      eventprofile: "Stonehenge Profile (1200)",
      streamtype: "whitepaper",
      tags: ["AFO Tech Sales"],
      contenttype: "webpage",
      lastupdated: "2024-01-22T09:39:38-08:00",
      media: {
        videos: [
          "http://pm.on24.com/media/cv/events/video_library/client/https://www.agilent.com/cs/library/citations/brochure-research-citation-microarray-ngs-solutions-5994-2946EN-agilent.pdf"
        ]
      }
    },
    {
      eventid: 19,
      clientid: 19,
      goodafter: "2024-01-02T12:05:00-08:00",
      description: "Agilent SureSelect CD CiberMed Heme and Heme+HiRes (Control) Panels",
      displaytimezonecd: "America/Los_Angeles",
      eventtype: "webpage",
      createdby: "Shuang Wu",
      createtimestamp: "2024-01-02T12:04:33-08:00",
      localelanguagecd: "en",
      lastmodified: "2024-04-23T13:14:43-07:00",
      livestart: "2024-01-02T12:05:00-08:00",
      liveend: "2024-01-02T12:05:00-08:00",
      eventprofile: "Stonehenge Profile (1200)",
      streamtype: "whitepaper",
      tags: ["AFO Tech Sales"],
      contenttype: "webpage",
      lastupdated: "2024-04-19T14:18:54-07:00",
      media: {
        videos: [
          "http://pm.on24.com/media/cv/events/video_library/client/https://www.agilent.com/cs/library/flyers/public/flyer-sureselect-cd-cibermedheme-5994-6851en-agilent.pdf"
        ]
      }
    },
    {
      eventid: 20,
      clientid: 20,
      goodafter: "2024-01-03T08:55:00-08:00",
      description: "Agilent Microarray and NGS Solutions Research Citation Collection",
      displaytimezonecd: "America/Los_Angeles",
      eventtype: "webpage",
      createdby: "Shuang Wu",
      createtimestamp: "2024-01-03T08:54:59-08:00",
      localelanguagecd: "en",
      lastmodified: "2024-01-26T09:24:33-08:00",
      livestart: "2024-01-03T08:55:00-08:00",
      liveend: "2024-01-03T08:55:00-08:00",
      eventprofile: "Stonehenge Profile (1200)",
      streamtype: "whitepaper",
      tags: ["AFO Tech Sales"],
      contenttype: "webpage",
      lastupdated: "2024-01-22T09:39:38-08:00",
      media: {
        videos: [
          "http://pm.on24.com/media/cv/events/video_library/client/https://www.agilent.com/cs/library/citations/brochure-research-citation-microarray-ngs-solutions-5994-2946EN-agilent.pdf"
        ]
      }
    }
  ]
};

// Updated /events endpoint with pagination
app.get('/events', (req, res) => {
  const page = parseInt(req.query.page) || 1; // default to page 1
  const limit = parseInt(req.query.limit) || 10; // default to 10 records per page

  // Calculate start and end indices
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Slice the events array for pagination
  const paginatedEvents = eventData.events.slice(startIndex, endIndex);

  // Return paginated results with additional metadata
  res.json({
    currentPage: page,
    pageCount: Math.ceil(eventData.events.length / limit),
    totalEvents: eventData.events.length,
    events: paginatedEvents
  });
});


// Endpoint to download all events data as an Excel file
app.get('/download-events', async (req, res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Events');

  // Adding header row
  worksheet.columns = [
    { header: 'Event ID', key: 'eventid', width: 15 },
    { header: 'Client ID', key: 'clientid', width: 15 },
    { header: 'Description', key: 'description', width: 50 },
    { header: 'Start Time', key: 'livestart', width: 25 },
    { header: 'End Time', key: 'liveend', width: 25 }
  ];

  // Adding data rows
  eventData.events.forEach(event => {
    worksheet.addRow({
      eventid: event.eventid,
      clientid: event.clientid,
      description: event.description,
      livestart: event.livestart,
      liveend: event.liveend
    });
  });

  // Setting headers to download file as attachment
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=events.xlsx');

  // Write to response
  await workbook.xlsx.write(res);
  res.end();
});

// Endpoint to register a new user
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if the user already exists
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully!' });
});

// Endpoint to login a user
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find user by username
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare the password with the stored hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
});

// tableDisplay route
app.get('/tableDisplay', authenticateJWT, (req, res) => {
    res.json({ message: 'You are authorized to see this content', user: req.user });
});

// Middleware to authenticate JWT
function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, 'your_jwt_secret', (err, user) => {
            if (err) {
                return res.sendStatus(403); // Invalid token
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401); // No token provided
    }
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
