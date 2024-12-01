import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "safeURL", standalone: true })
export class SafeURLPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  public transform(url: string): SafeResourceUrl {
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
