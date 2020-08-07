import { Component, OnInit } from '@angular/core';
import { ReportService } from '@modules/report/_service/report.service';
import { PermissionOn, ReportDashboardPermission, PermissionType } from '@models/collaborator';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export class PermissionGroup {
  groupId: string;
  groupDesc: string;
  childs: ReportDashboardPermission[];
}
@Component({
  selector: 'pros-report-collaborator',
  templateUrl: './report-collaborator.component.html',
  styleUrls: ['./report-collaborator.component.scss']
})
export class ReportCollaboratorComponent implements OnInit {

  /**
   * All collaborators response
   */
  permissionOn: PermissionOn;

  /**
   * Hold all collaborators with groups
   */
  collaborators: PermissionGroup[];

  /**
   * Assigned collaborators list
   */
  collaboratorList: ReportDashboardPermission[];
  collaboratorListOb: Observable<ReportDashboardPermission[]> = of([]);

  addCollaboratorFrmGrp: FormGroup;
  searchCollCtrl: FormControl = new FormControl('');
  reportId: string;

  /**
   * Selected collaborators before saved
   */
  selectedCollaborators: ReportDashboardPermission[] = [];
  possibleChips: ReportDashboardPermission[] = [];
  currentPageIdx = 0;

  constructor(
    private reportServie: ReportService,
    private formBuilder: FormBuilder,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getCollaboratorPermission('');
    this.activatedRouter.params.subscribe(param => {
      this.reportId = param.reportId;
    });
    this.getExitingCollaborators();

    this.addCollaboratorFrmGrp = this.formBuilder.group({
      addCollaboratorCtrl: [''],
      isViewable: [false],
      isEditable: [false],
      isDeleteable: [false]
    });

    /**
     * After value change should call http for load more collaborators
     */
    this.addCollaboratorFrmGrp.get('addCollaboratorCtrl').valueChanges.subscribe(val => {
      if (val && typeof val === 'string') {
        this.getCollaboratorPermission(val);
      } else if (typeof val === 'string' && val.trim() === '') {
        this.getCollaboratorPermission('');
      }
    })

    /**
     * Filtered added collaborators
     */
    this.searchCollCtrl.valueChanges.subscribe(val => {
      this.collaboratorListOb = of(this.collaboratorList.filter(fil => {
        if (fil.userMdoModel && fil.userMdoModel.fullName.toLocaleLowerCase().indexOf(val.toLocaleLowerCase()) !== -1) {
          return fil;
        }

        if (fil.rolesModel && fil.rolesModel.roleDesc.toLocaleLowerCase().indexOf(val.toLocaleLowerCase()) !== -1) {
          return fil;
        }

        if (fil.groupHeaderModel && fil.groupHeaderModel.description.toLocaleLowerCase().indexOf(val.toLocaleLowerCase()) !== -1) {
          return fil;
        }

      }));
    })
  }

  /**
   * Get all collaborators permission
   * @param queryString search able string
   */
  getCollaboratorPermission(queryString: string) {
    this.reportServie.getCollaboratorPermission(queryString).subscribe(response => {
      this.permissionOn = response;
      this.collaborators = this.transformResponse(response);
    }, error => console.error(`Error: ${error}`));
  }

  /**
   * Help to tarnsfor response into groups
   * @param response from server for (all collaborators)
   */
  transformResponse(response: PermissionOn): PermissionGroup[] {
    const grps: PermissionGroup[] = [];
    // for user
    if (response && response.users) {
      const userGrp = new PermissionGroup();
      userGrp.childs = [];
      response.users.forEach(user => {
        const permission = new ReportDashboardPermission();
        permission.userId = user.userName;
        permission.description = user.fullName ? user.fullName : user.email;
        permission.permissionType = PermissionType.USER;
        userGrp.childs.push(permission);
      });
      userGrp.groupId = 'user_group';
      userGrp.groupDesc = 'Users';
      grps.push(userGrp);
    }

    // for roles
    if (response && response.roles) {
      const userGrp = new PermissionGroup();
      userGrp.childs = [];
      response.roles.forEach(role => {
        const permission = new ReportDashboardPermission();
        permission.roleId = role.roleId;
        permission.description = role.roleDesc;
        permission.permissionType = PermissionType.ROLE;
        userGrp.childs.push(permission);
      });
      userGrp.groupId = 'roles';
      userGrp.groupDesc = 'Roles';
      grps.push(userGrp);
    }

    // groups
    if (response && response.groups) {
      const userGrp = new PermissionGroup();
      userGrp.childs = [];
      response.groups.forEach(grp => {
        const permission = new ReportDashboardPermission();
        permission.groupId = grp.groupIdAsStr;
        permission.description = grp.description;
        permission.permissionType = PermissionType.GROUP;
        userGrp.childs.push(permission);
      });
      userGrp.groupId = 'groups';
      userGrp.groupDesc = 'Groups';
      grps.push(userGrp);
    }
    return grps;
  }

  /**
   * Displaywith help to display selection with option description
   * @param option from mat-autocomplete
   */
  displayWith(option: ReportDashboardPermission): string {
    return option ? option.description : null;
  }

  /**
   * Use for set selected item
   * @param event after selection change on collaborators list
   */
  onSelectCollaborator(event: MatAutocompleteSelectedEvent) {
    if (event && event.option) {
      const selVal: ReportDashboardPermission = event.option.value;
      let isAlreadyExits = false;
      if (selVal.permissionType === PermissionType.USER) {
        const user = this.permissionOn.users.filter(fil => fil.userName === selVal.userId)[0];
        selVal.userMdoModel = user;
        isAlreadyExits = this.selectedCollaborators.filter(fil => fil.userId === selVal.userId).length ? true : false;
      } else if (selVal.permissionType === PermissionType.GROUP) {
        const grp = this.permissionOn.groups.filter(fil => fil.groupIdAsStr === selVal.groupId)[0];
        selVal.groupHeaderModel = grp;
        isAlreadyExits = this.selectedCollaborators.filter(fil => fil.groupId === selVal.groupId).length ? true : false;
      } else if (selVal.permissionType === PermissionType.ROLE) {
        const role = this.permissionOn.roles.filter(fil => fil.roleId === selVal.roleId)[0];
        selVal.rolesModel = role;
        isAlreadyExits = this.selectedCollaborators.filter(fil => fil.roleId === selVal.roleId).length ? true : false;
      }

      if (selVal && !isAlreadyExits) {
        this.selectedCollaborators.push(selVal);
        if (this.currentPageIdx === 0 && this.possibleChips.length < 2) {
          this.possibleChips.push(selVal);
          this.currentPageIdx = 0;
        }
      }
      this.addCollaboratorFrmGrp.controls.addCollaboratorCtrl.reset();
    }
  }

  /**
   * Get all exiting added collaborators
   */
  getExitingCollaborators() {
    this.reportServie.getCollaboratorsPermisison(this.reportId).subscribe(res => {
      this.collaboratorList = res;
      this.collaboratorListOb = of(res);
    }, error => console.error(`Error : ${error}`));
  }

  /**
   * Should create possibleChips to view on mat-chip-list
   * @param where get the pagination call from prev | next
   */
  paginateChip(where?: string) {
    const reverseSelected = this.selectedCollaborators;
    if (where === 'prev' && this.currentPageIdx > 0) {
      this.possibleChips = [];
      if (reverseSelected[(this.currentPageIdx * 2) - 2])
        this.possibleChips.push(reverseSelected[(this.currentPageIdx * 2) - 2]);
      if (reverseSelected[(this.currentPageIdx * 2) - 1])
        this.possibleChips.push(reverseSelected[(this.currentPageIdx * 2) - 1]);
      this.currentPageIdx--;
    }
    else if (where === 'next' && this.currentPageIdx < this.selectedCollaborators.length) {
      this.possibleChips = [];
      this.currentPageIdx++;
      if (reverseSelected[this.currentPageIdx * 2])
        this.possibleChips.push(reverseSelected[this.currentPageIdx * 2]);
      if (reverseSelected[(this.currentPageIdx * 2) + 1])
        this.possibleChips.push(reverseSelected[(this.currentPageIdx * 2) + 1]);
    } else {
      this.possibleChips = [];
      if (reverseSelected[this.currentPageIdx * 2])
        this.possibleChips.push(reverseSelected[this.currentPageIdx * 2]);
      if (reverseSelected[(this.currentPageIdx * 2) + 1])
        this.possibleChips.push(reverseSelected[(this.currentPageIdx * 2) + 1]);
    }
  }

  /**
   * Should remove selected user / group / role from list
   * @param removeAble Remove able selected user / group / role
   */
  remove(removeAble: ReportDashboardPermission) {
    let selecteItemIdx;
    let possibleChipsIdx;
    if (removeAble && removeAble.permissionType === PermissionType.USER) {
      const selData = this.selectedCollaborators.filter(fil => fil.userId === removeAble.userId)[0];
      selecteItemIdx = this.selectedCollaborators.indexOf(selData);
      const possibleCh = this.possibleChips.filter(fil => fil.userId === removeAble.userId)[0];
      possibleChipsIdx = this.possibleChips.indexOf(possibleCh);
    } else if (removeAble && removeAble.permissionType === PermissionType.GROUP) {
      const selData = this.selectedCollaborators.filter(fil => fil.groupId === removeAble.groupId)[0];
      selecteItemIdx = this.selectedCollaborators.indexOf(selData);
      const possibleCh = this.possibleChips.filter(fil => fil.groupId = removeAble.groupId)[0];
      possibleChipsIdx = this.possibleChips.indexOf(possibleCh);
    } else if (removeAble && removeAble.permissionType === PermissionType.ROLE) {
      const selData = this.selectedCollaborators.filter(fil => fil.roleId === removeAble.roleId)[0];
      selecteItemIdx = this.selectedCollaborators.indexOf(selData);
      const possibleCh = this.possibleChips.filter(fil => fil.roleId = removeAble.roleId)[0];
      possibleChipsIdx = this.possibleChips.indexOf(possibleCh);
    }

    if (selecteItemIdx !== undefined && possibleChipsIdx !== undefined) {
      this.selectedCollaborators.splice(selecteItemIdx, 1);
      this.possibleChips.splice(possibleChipsIdx, 1);
      this.paginateChip();
    }
  }


  /**
   * To check / enable previuos button
   */
  get enablePreBtn() {
    return this.currentPageIdx <= 0;
  }

  /**
   * To check / enable next button
   */
  get enableNextBtn() {
    return ((this.currentPageIdx * 2 + 2) < this.selectedCollaborators.length && this.selectedCollaborators.length > 2);
  }

  /**
   * While click on close should be set sb outlet to null
   */
  close() {
    this.router.navigate([{ outlets: { sb: null } }]);
  }

  /**
   * Should http call for update selected permission
   * @param permission update able permission
   */
  updatePermission(permission: ReportDashboardPermission) {
    this.reportServie.saveUpdateReportCollaborator([permission]).subscribe(res => {
      this.getExitingCollaborators();
    }, error => console.error(`Error : ${error}`));
  }

  /**
   * For delete assigned collaborator based on assigned permission
   * @param permissionId permission id which we want to delete
   */
  deleteCollaborator(permissionId: string) {
    this.reportServie.deleteCollaborator(permissionId).subscribe(res => {
      if (res) {
        this.snackBar.open(`Successfully deleted`, 'Close', { duration: 4000 });
        this.getExitingCollaborators();
      } else {
        this.snackBar.open(`Something went wrong`, 'Close', { duration: 4000 });
      }
    }, error => {
      this.snackBar.open(`Something went wrong`, 'Close', { duration: 4000 });
    });
  }

  /**
   * Save or update selected permission
   */
  saveCollaborators() {
    const value = this.addCollaboratorFrmGrp.value;
    this.selectedCollaborators.forEach(coll => {
      coll.isEditable = value.isEditable ? value.isEditable : false;
      coll.isDeleteable = value.isDeleteable ? value.isDeleteable : false;
      coll.isViewable = value.isViewable ? value.isViewable : false;
      coll.permissionId = Math.floor(Math.random() * 1000000000);
      coll.reportId = this.reportId;
    });
    this.reportServie.saveUpdateReportCollaborator(this.selectedCollaborators).subscribe(res => {
      this.addCollaboratorFrmGrp.reset();
      this.selectedCollaborators = [];
      this.possibleChips = [];
      this.currentPageIdx = 0;
      this.getExitingCollaborators();
    }, error => { });
  }

}
