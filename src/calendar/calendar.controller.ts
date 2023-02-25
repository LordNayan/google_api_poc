import { Controller, Get } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Controller('calendar')
export class CalendarController {
  private getCalendarEventsUrl =
    'https://admin.googleapis.com/admin/reports/v1/activity/users/all/applications/calendar?eventName=create_event&maxResults=10&access_token=';
  constructor(private httpService: HttpService) {}

  async callGetApi(url) {
    const { data } = await firstValueFrom(
      this.httpService.get(url).pipe(
        catchError((error) => {
          throw error.response.data;
        }),
      ),
    );
    return data;
  }

  @Get('events')
  private async listCalendarEvents() {
    try {
      let data = await this.callGetApi(this.getCalendarEventsUrl);
      const result = [];
      while (data.nextPageToken) {
        data.items.forEach((d) => {
          const eventParameters = d.events[0].parameters;
          const eventContainingDemo = eventParameters.find((p) => p.name === 'event_title' && p.value.indexOf('demo') !== -1);
          if (eventContainingDemo) {
            result.push(data);
          }
        });
        data = await this.callGetApi(`${this.getCalendarEventsUrl}&pageToken=${data.nextPageToken}`);
      }
      return result;
    } catch (error) {
      return error;
    }
  }
}
