import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { ReferralService } from '../Services/referralService';
import { ReferralModel } from '../Model/referralModel';
import { LetterModel } from '../Model/LetterModel';
import { CookieService } from 'ngx-cookie-service';
import { Typeenum } from '../Model/enumletter/Typeenum';
import { CorrespondenceService } from '../Services/correspondenceService';
import { TypeEnumPipePipe } from '../Pipe/TypeEnumPipe-pipe';
import { PriorityPipe } from '../Pipe/priority-pipe';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-senderletter',
  imports: [TypeEnumPipePipe,PriorityPipe,DatePipe,NgClass],
  templateUrl: './senderletter.html',
  styleUrl: './senderletter.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Senderletter implements OnInit
 {
  activeTab = signal<string>('All');
  referrals = signal<ReferralModel[]>([]);
   selectedReferral = signal<ReferralModel | null>(null);
    selectedLetter = signal<LetterModel | null>(null);
  ngOnInit(): void {
    this.loadReferrals('All');
  } 
  constructor(private refservice: ReferralService,private cookie: CookieService,private letterservice: CorrespondenceService)
  {

  }
  loadReferrals(tabName: string)
    {
      this.activeTab.set(tabName);
  
  
      if(tabName=='All')
      {
         this.refservice.getAllbySenderposition(+this.cookie.get('id')).subscribe(
            {
              next: (data)=>
              {
                this.referrals.set(data);
                console.log("myref: ",this.referrals);
                // Clear the right panel when switching tabs
                this.selectedReferral.set(null);
                this.selectedLetter.set(null);
              },
              error: (err) =>
              {
                console.error('Error loading referrals', err);
              }
            });
      }
      else
      {
        
        this.refservice.getReferralbyTypeSenderid(Number(this.cookie.get('id')),tabName as unknown as Typeenum).subscribe(
          {
            next: (data)=>
            {
              this.referrals.set(data);
              this.selectedReferral.set(null);
              this.selectedLetter.set(null);
            },
            error: (err)=>
            {
              console.log(err);
            }
          })
      }
  
    }
     onReferralClick(referral: ReferralModel)
   {
    this.selectedReferral.set(referral);
    this.letterservice.getLetter(referral.letterID).subscribe(
      {
        next: (data) =>
        {
          this.selectedLetter.set(data);
          
        }
      })
   }
   getStepStatus(currentStatus: number | undefined, stepValue: number): 'done' | 'active' | 'pending' {
    if(this.selectedReferral()?.actionType==0 && this.selectedReferral()?.status!=1)
    {
      currentStatus=currentStatus!+2;
    }
    else
    currentStatus=currentStatus! + 1;
    if (currentStatus === undefined) return 'pending';
    if (currentStatus > stepValue) return 'done';
    if (currentStatus === stepValue) return 'active';
    return 'pending';
  }

 }
