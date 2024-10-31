import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  communityStateChange = new BehaviorSubject<boolean>(false);
  isMemberShow = new BehaviorSubject<boolean>(false);
  isP2PComm = new BehaviorSubject<boolean>(false);
  isAdministratorShow = new BehaviorSubject<boolean>(false);

  constructor() {
  }

  changeCommunityState(state: boolean) {
    this.communityStateChange.next(state);
  }

  changeMemberState(state: boolean) {
    this.isMemberShow.next(state);
  }
  changeP2PCommState(state: boolean) {
    this.isP2PComm.next(state);
  }

  changeAdministratorState(state: boolean) {
    this.isAdministratorShow.next(state);
  }
}
