import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { authservice } from '../../Services/authservice';
import { Router } from '@angular/router';
import { ForgeReel } from '../../forge-reel/forge-reel';

@Component({
  selector: 'app-login',
  imports: [FormsModule,ForgeReel],
  templateUrl: `./login.html`,
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnInit {
  Login:any={};
  constructor(private auth:authservice,private router:Router){}
  ngOnInit() {
    
  }
  handleSubmit()
  {
   this.auth.Login(this.Login).subscribe({
      next: (response) => {
        console.log('Success from component!', response);
      },
      error: (error) => {
        console.error('Error from component:', error);
      },
      complete: () =>
      {
        this.router.navigate(['/mainpage']);
      }
    });
  }
 }
