import { Component, ViewChild, ViewContainerRef, Input, ComponentFactoryResolver, SimpleChange, OnChanges } from '@angular/core';
import * as TrafficProcess from '../forms/trafficProcess/traffic-process.module';

@Component({
  selector: 'app-generic-form',
  templateUrl: './generic-form.component.html',
  styleUrls: ['./generic-form.component.scss'],
})
export class GenericFormComponent implements OnChanges {
  @ViewChild('dynamic', { read: ViewContainerRef, static: true }) viewContainerRef: ViewContainerRef | undefined;

  @Input() formKey?: string;
  @Input() taskId?: string;
  private rootViewContainer: any;
  private myAddonModule: any;

  constructor(private factoryResolver: ComponentFactoryResolver) {}

  ngOnChanges(changes: { [propKey: string]: SimpleChange }): void {
    for (const propName in changes) {
      if (propName === 'formKey' && changes[propName].currentValue != null) {
        this.loadForm(changes[propName].currentValue);
      }
    }
  }

  loadForm(formKey: string): void {
    this.setRootViewContainerRef(this.viewContainerRef);
    this.addDynamicComponent(formKey);
  }

  public setRootViewContainerRef(viewContainerRef: any): void {
    this.rootViewContainer = viewContainerRef;
  }

  public addDynamicComponent(formKey: string): void {
    console.log('formKey', formKey);
    const factory = this.factoryResolver.resolveComponentFactory(TrafficProcess[formKey + 'Component']);
    const component = factory.create(this.rootViewContainer.parentInjector);
    console.log('component', component);
    this.rootViewContainer.insert(component.hostView);
  }
}
