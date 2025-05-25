import { Component, Input, OnInit } from '@angular/core';
import { storage } from '../../firebase-init';
import { ref, listAll, getDownloadURL } from 'firebase/storage';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  businessPhotos: { url: string; description: string }[] = [];
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
              description: 'Pre-pleat'
            });
          });
        });
      })
      .catch(error => {
        console.error('Error fetching images:', error);
      });
  }

  openWhatsapp() {
    const phoneNumber = '+917010195676';
    const url = `https://wa.me/${phoneNumber.replace('+', '')}`;
    window.open(url, '_blank');
  }

  openInstagram() {
  const url = 'https://www.instagram.com/pleatswithdivu/';
  window.open(url, '_blank');
}
}
