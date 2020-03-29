import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  settings =   {
    "columns": {
      "id": {
        "title": "ID",
        "filter": {}
      },
      "coreid": {
        "title": "CoreId",
        "filter": {
          "type": "list",
          "config": {
            "selectText": "Select ...",
            "list": []
          }
        }
      },
      "event": {
        "title": "Event",
        "filter": {
          "type": "list",
          "config": {
            "selectText": "Select ...",
            "list": []
          }
        }
      },
      "data": {
        "title": "Data",
        "filter": {
          "type": "list",
          "config": {
            "selectText": "Select ...",
            "list": []
          }
        }
      },
      "publishedAt": {
        "title": "Published At",
        "filter": {}
      }
    },
    "delete": {
      "confirmDelete": true
    },
    "add": {
      "confirmCreate": true
    },
    "edit": {
      "confirmSave": true
    },
    "actions": {
      "add": false,
      "edit": false,
      "delete": false
    }
  };
  source =   [
    {
      "coreid": "Danielle Kennedy",
      "id": 1,
      "event": "danielle.kennedy",
      "data": "danielle_91@example.com"
    },
    {
      "coreid": "Russell Payne",
      "id": 2,
      "event": "russell.payne",
      "data": "russell_88@example.com"
    },
    {
      "coreid": "Brenda Hanson",
      "id": 3,
      "event": "brenda.hanson",
      "data": "brenda97@example.com"
    },
    {
      "coreid": "Nathan Knight",
      "id": 4,
      "event": "nathan.knight",
      "data": "nathan-85@example.com"
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
