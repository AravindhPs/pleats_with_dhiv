import { Component, OnInit } from '@angular/core';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  businessPhotos: { url: string; description: string }[] = [];

  ngOnInit(): void {
    const storage = getStorage();
    const listRef = ref(storage, 'business-photos/');

    listAll(listRef)
      .then(result => {
        result.items.forEach(itemRef => {
          getDownloadURL(itemRef).then(url => {
            const fileName = itemRef.name.split('.')[0].replace(/[-_]/g, ' ');
            this.businessPhotos.push({
              url,
              description: this.shorten(fileName)
            });
          });
        });
      })
      .catch(error => {
        console.error('Error fetching images:', error);
      });
  }

  shorten(text: string): string {
    return text.split(' ').slice(0, 3).join(' '); // Max 3 words
  }
}
