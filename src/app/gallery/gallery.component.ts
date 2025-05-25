import { Component, Input, OnInit } from '@angular/core';
import { storage } from '../../firebase-init';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { CommonServiceService } from '../common-service.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  constructor(public commonService: CommonServiceService) {

  }
  businessPhotos: { url: string; description: string }[] = [];
  selectedImage: string | null = null;

  openImageModal(url: string): void {
    this.selectedImage = url;
  }

  closeImageModal(): void {
    this.selectedImage = null;
  }

  @Input() name: string = '';
  ngOnInit(): void {
    const listRef = ref(storage, 'gs://pleatswithdivu.firebasestorage.app/businessPhotos/');

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

  openGoogleReview(): void {
    window.open('https://g.page/r/CY2Ajw0rWrkUEBM/review', '_blank');
  }


  shorten(text: string): string {
    return text.split(' ').slice(0, 3).join(' ');
  }

  checkStatus() {
    let data = {
      customerRequest: true,
      page: 'loadCustomer'
    }
    this.commonService.sendMessage(JSON.stringify(data))
  }
}
