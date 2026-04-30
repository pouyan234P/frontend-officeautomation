import { AfterViewInit, ChangeDetectionStrategy, Component, computed, ElementRef, OnDestroy, signal, ViewChild } from '@angular/core';

@Component({
  selector: 'app-forge-reel',
  imports: [],
  templateUrl: './forge-reel.html',
  styleUrl: './forge-reel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgeReel implements AfterViewInit, OnDestroy {
 private progVal = 0;
  private progTimer: any;

  ngAfterViewInit(): void {
    this.startReel();
  }

  ngOnDestroy(): void {
    clearInterval(this.progTimer);
  }

  private $<T extends HTMLElement>(id: string): T {
    return document.getElementById(id) as T;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(r => setTimeout(r, ms));
  }

  private setStyles(el: HTMLElement | null, s: Partial<CSSStyleDeclaration>): void {
    if (el) Object.assign(el.style, s);
  }

  private animProg(target: number, dur: number): Promise<void> {
    return new Promise(r => {
      clearInterval(this.progTimer);
      const start = this.progVal, steps = 60, interval = dur / steps;
      let i = 0;
      this.progTimer = setInterval(() => {
        i++; this.progVal = start + (target - start) * (i / steps);
        this.$('prog-bar').style.width = this.progVal + '%';
        if (i >= steps) { clearInterval(this.progTimer); r(); }
      }, interval);
    });
  }

  private setDot(n: number): void {
    for (let i = 0; i < 6; i++) {
      this.$('d' + i)?.classList.toggle('active', i === n);
    }
  }

  private slideToScene(n: number): void {
    this.$('reel').style.transform = `translateX(-${n * 20}%)`;
    this.setDot(n);
  }

  private async typeText(elId: string, text: string, speed = 28): Promise<void> {
    const el = this.$(elId);
    if (!el) return;
    el.innerHTML = '';
    const cur = document.createElement('span');
    cur.className = 'cursor';
    el.appendChild(cur);
    for (const ch of text) {
      el.insertBefore(document.createTextNode(ch), cur);
      await this.delay(speed);
    }
    cur.remove();
  }

  // Paste scene1(), scene2(), scene3(), scene4(), scene5() here
  // (same logic as the original JS, just use `this.` prefix on helpers)
private async scene1(): Promise<void> {
  this.setStyles(this.$('ic1'), { opacity: '0', transform: 'scale(.3) rotate(-15deg)', transition: 'opacity .7s ease,transform .7s cubic-bezier(.16,1,.3,1)' });
  this.setStyles(this.$('nm1'), { opacity: '0', transform: 'translateY(20px)', transition: 'opacity .5s ease .4s,transform .5s ease .4s' });
  this.setStyles(this.$('sb1'), { opacity: '0', transition: 'opacity .5s ease .7s' });
  this.setStyles(this.$('tl1'), { width: '0', transition: 'width 1.2s ease .9s' });
  this.setStyles(this.$('tg1'), { opacity: '0', transform: 'translateY(10px)', transition: 'opacity .4s ease 1.2s,transform .4s ease 1.2s' });

  await this.delay(200);
  this.setStyles(this.$('ic1'), { opacity: '1', transform: 'scale(1) rotate(0deg)' });
  await this.delay(500);
  this.setStyles(this.$('nm1'), { opacity: '1', transform: 'translateY(0)' });
  await this.delay(300);
  this.setStyles(this.$('sb1'), { opacity: '1' });
  this.setStyles(this.$('tl1'), { width: '260px' });
  await this.delay(500);
  this.setStyles(this.$('tg1'), { opacity: '1', transform: 'translateY(0)' });
  await this.animProg(20, 600);
  await this.delay(1200);
}

private async scene2(): Promise<void> {
  this.slideToScene(1);
  await this.animProg(35, 400);
  const hdr = this.$('org-hdr');
  this.setStyles(hdr, { opacity: '0', transform: 'translateY(-12px)', transition: 'opacity .4s,transform .4s' });
  await this.delay(100);
  this.setStyles(hdr, { opacity: '1', transform: 'translateY(0)' });
  await this.delay(300);

  const boxes = ['ob0', 'ob1', 'ob2', 'ob3', 'ob4', 'ob5', 'ob6'];
  const cons = ['oc0', 'oc1', 'oc2'];
  boxes.forEach(id => this.setStyles(this.$(id), { opacity: '0', transform: 'translateY(16px) scale(.9)', transition: 'opacity .4s,transform .4s' }));
  cons.forEach(id => this.setStyles(this.$(id), { opacity: '0' }));

  await this.delay(200);
  this.setStyles(this.$('ob0'), { opacity: '1', transform: 'translateY(0) scale(1)' });
  await this.delay(300);
  this.setStyles(this.$('oc0'), { opacity: '1', transition: 'opacity .3s' });
  await this.delay(250);
  this.setStyles(this.$('ob1'), { opacity: '1', transform: 'translateY(0) scale(1)', transitionDelay: '.0s' });
  this.setStyles(this.$('ob4'), { opacity: '1', transform: 'translateY(0) scale(1)', transitionDelay: '.1s' });
  await this.delay(350);
  this.setStyles(this.$('oc1'), { opacity: '1', transition: 'opacity .3s' });
  this.setStyles(this.$('oc2'), { opacity: '1', transition: 'opacity .3s' });
  await this.delay(250);
  this.setStyles(this.$('ob2'), { opacity: '1', transform: 'translateY(0) scale(1)', transitionDelay: '.0s' });
  this.setStyles(this.$('ob3'), { opacity: '1', transform: 'translateY(0) scale(1)', transitionDelay: '.1s' });
  this.setStyles(this.$('ob5'), { opacity: '1', transform: 'translateY(0) scale(1)', transitionDelay: '.0s' });
  this.setStyles(this.$('ob6'), { opacity: '1', transform: 'translateY(0) scale(1)', transitionDelay: '.15s' });
  await this.animProg(55, 800);
  await this.delay(1400);
}

private async scene3(): Promise<void> {
  this.slideToScene(2);
  await this.animProg(65, 300);
  const hdr = this.$('wf-hdr');
  this.setStyles(hdr, { opacity: '0', transform: 'translateY(-12px)', transition: 'opacity .4s,transform .4s' });
  await this.delay(100);
  this.setStyles(hdr, { opacity: '1', transform: 'translateY(0)' });

  const steps = ['ws1', 'ws2', 'ws3', 'ws4'];
  const conns = ['wc1', 'wc2', 'wc3'];
  steps.forEach(id => this.setStyles(this.$(id), { opacity: '0', transform: 'translateX(-20px)', transition: 'opacity .45s,transform .45s' }));
  conns.forEach(id => this.setStyles(this.$(id), { opacity: '0' }));

  await this.delay(300);
  for (let i = 0; i < steps.length; i++) {
    this.setStyles(this.$(steps[i]), { opacity: '1', transform: 'translateX(0)' });
    if (i < conns.length) {
      await this.delay(200);
      this.setStyles(this.$(conns[i]), { opacity: '1', transition: 'opacity .3s' });
    }
    await this.delay(280);
  }
  await this.animProg(80, 600);
  await this.delay(1400);
}

private async scene4(): Promise<void> {
  this.slideToScene(3);
  await this.animProg(88, 300);
  const hdr = this.$('cor-hdr');
  this.setStyles(hdr, { opacity: '0', transform: 'translateY(-12px)', transition: 'opacity .4s,transform .4s' });
  await this.delay(100);
  this.setStyles(hdr, { opacity: '1', transform: 'translateY(0)' });

  const lw = this.$('letter-wrap');
  this.setStyles(lw, { opacity: '0', transform: 'translateY(16px)', transition: 'opacity .5s,transform .5s' });
  await this.delay(200);
  this.setStyles(lw, { opacity: '1', transform: 'translateY(0)' });
  await this.delay(400);

  await this.typeText('ltr-subj', 'Re: Budget Allocation Request — Q2 FY2026', 22);
  await this.delay(200);
  await this.typeText('ltr-p1', 'We write to formally request the release of allocated funds for the Q2 operational budget as approved in session 14-2026.', 30);
  await this.delay(150);
  await this.typeText('ltr-p2', 'Kindly process at your earliest convenience and confirm receipt via the FORGE correspondence portal.', 32);
  await this.delay(300);
  this.setStyles(this.$('ltr-sig'), { opacity: '1' });
  await this.delay(400);
  this.setStyles(this.$('ltr-sts'), { opacity: '1' });
  await this.animProg(100, 500);
  await this.delay(1200);
}
private async scene6(): Promise<void> {
    this.slideToScene(4);  // was index 4 (end card), now scene6 is at 5
    await this.animProg(90, 300);

    const hdr = this.$('ui6-hdr');
    this.setStyles(hdr, { opacity: '0', transform: 'translateY(-12px)', transition: 'opacity .4s,transform .4s' });
    await this.delay(80);
    this.setStyles(hdr, { opacity: '1', transform: 'translateY(0)' });
    await this.delay(300);

    // Both panes slide in simultaneously
    this.setStyles(this.$('ui6-left'), { opacity: '1', transform: 'translateX(0)' });
    this.setStyles(this.$('ui6-right'), { opacity: '1', transform: 'translateX(0)' });
    await this.delay(400);

    // List items cascade in
    for (let i = 0; i < 6; i++) {
      const el = this.$('u6i' + i);
      if (el) this.setStyles(el, { opacity: '1', transform: 'translateX(0)' });
      await this.delay(90);
    }
    await this.delay(200);

    // Detail title
    this.setStyles(this.$('ui6-d-title'), { opacity: '1' });
    await this.delay(200);

    // Abstract bar
    this.setStyles(this.$('ui6-abstract'), { opacity: '1' });
    await this.delay(200);

    // Flow section
    this.setStyles(this.$('ui6-flow'), { opacity: '1' });
    await this.delay(200);

    // Flow nodes animate in one by one with line fills
    const nodes = ['fn0', 'fn1', 'fn2', 'fn3', 'fn4'];
    const lines = ['fl0', 'fl1', 'fl2', 'fl3'];
    for (let i = 0; i < nodes.length; i++) {
      const n = this.$(nodes[i]);
      if (n) this.setStyles(n, { opacity: '1', transform: 'scale(1)' });
      await this.delay(200);
      if (i < lines.length) {
        const l = this.$(lines[i]);
        if (i < 2) this.setStyles(l, { width: '100%' }); // only completed steps fill
      }
      await this.delay(150);
    }
    await this.delay(200);

    // Body text
    this.setStyles(this.$('ui6-body'), { opacity: '1' });
    await this.delay(300);

    // Action buttons
    this.setStyles(this.$('ui6-actions'), { opacity: '1', transform: 'translateY(0)' });
    await this.animProg(98, 600);
    await this.delay(1200);
  }

private async scene5(): Promise<void> {
  this.slideToScene(5);
  await this.delay(300);
  const ei = this.$('ec-icon'), et = this.$('ec-title'), es = this.$('ec-sub'), eg = this.$('ec-tags');
  this.setStyles(ei, { opacity: '0', transform: 'scale(.5)', transition: 'opacity .6s,transform .6s' });
  this.setStyles(et, { opacity: '0', transform: 'translateY(12px)', transition: 'opacity .5s .3s,transform .5s .3s' });
  this.setStyles(es, { opacity: '0', transition: 'opacity .4s .6s' });
  this.setStyles(eg, { opacity: '0', transition: 'opacity .4s .8s' });
  await this.delay(100);
  this.setStyles(ei, { opacity: '1', transform: 'scale(1)' });
  await this.delay(400);
  this.setStyles(et, { opacity: '1', transform: 'translateY(0)' });
  await this.delay(300);
  this.setStyles(es, { opacity: '1' });
  await this.delay(200);
  this.setStyles(eg, { opacity: '1' });
}

  async startReel(): Promise<void> {
    this.progVal = 0;
    this.$('prog-bar').style.width = '0';
    this.$('reel').style.transition = 'none';
    this.slideToScene(0);
    await this.delay(50);
    this.$('reel').style.transition = 'transform .9s cubic-bezier(.77,0,.18,1)';
    await this.animProg(5, 200);
    await this.scene1();
    await this.scene2();
    await this.scene3();
    await this.scene4();
    await this.scene6();
    await this.scene5();
  }
}
