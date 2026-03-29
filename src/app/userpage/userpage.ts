import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Newuser } from '../ newuser/ newuser';
import { UserService } from '../Services/userService';
import { UserModel } from '../Model/userModel';
import { HttpResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PictureService } from '../Services/pictureService';
import { authservice } from '../Services/authservice';

@Component({
  selector: 'app-userpage',
  imports: [CommonModule, Newuser,FormsModule],
  templateUrl: './userpage.html',
  styleUrl: './userpage.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Userpage implements OnInit {
  myuser: UserModel[]=[];
  newuser:any={};
  selectedFile: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  uploadStatus: string = '';
  isUploading: boolean = false;
  ngOnInit(): void {
    this.loaduser();
  } 

  constructor(private userservice: UserService,private cdr: ChangeDetectorRef,private pictureservice: PictureService,private myauthservice: authservice)
  {

  }
 onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Basic validation
      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        this.uploadStatus = 'Upload failed: Only PNG and JPG are allowed.';
        this.clearSelection(input);
        return;
      }

      this.selectedFile = file;
      this.uploadStatus = ''; // Clear previous messages
      
      // Generate Image Preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // Clears the selected file and resets the UI
  clearSelection(inputElement: HTMLInputElement): void {
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    inputElement.value = ''; // Reset the hidden input
  }
  isModalOpen = false;
  openModal()  { this.isModalOpen = true;  }
  closeModal() { this.isModalOpen = false; }
  loaduser()
  {
    this.userservice.getAll().subscribe(
      {
       next: (data)=>
      {
        this.myuser=data;
        console.log(this.myuser);
        this.cdr.markForCheck(); 
      }
  });
  }
  onSave()
  {
    console.log(this.newuser);
    this.myauthservice.register(this.newuser).subscribe({
      error: (error)=>
      {
        console.log(error);
      },
      complete:()=>
      {
       this.closeModal();
      }
    });
  }
  onUpload(): void
  {
   if (!this.selectedFile) return;
    
    this.isUploading = true;
    
    this.pictureservice.addPicture(this.selectedFile).subscribe({
      next: (response) => {
        console.log('myresponse'+response);
        // FIXED: Assign the response to a property on the object instead of using .append()
        // (Change 'pictureUrl' to whatever your backend actually expects/returns)
        this.newuser.signitureid = response; 

        this.cdr.markForCheck(); 
      },
      error: (err) => {
        this.isUploading = false;
        console.error(err);
        this.cdr.markForCheck();
      }
    });
  }
}
