/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the 'License'); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var NfRegistryRoutes = require('nifi-registry/nf-registry.routes.js');
var ngCoreTesting = require('@angular/core/testing');
var ngCommonHttpTesting = require('@angular/common/http/testing');
var ngCommon = require('@angular/common');
var FdsDemo = require('nifi-registry/components/fluid-design-system/fds-demo.js');
var NfRegistry = require('nifi-registry/nf-registry.js');
var NfRegistryApi = require('nifi-registry/services/nf-registry.api.js');
var NfRegistryService = require('nifi-registry/services/nf-registry.service.js');
var NfPageNotFoundComponent = require('nifi-registry/components/page-not-found/nf-registry-page-not-found.js');
var NfRegistryExplorer = require('nifi-registry/components/explorer/nf-registry-explorer.js');
var NfRegistryAdministration = require('nifi-registry/components/administration/nf-registry-administration.js');
var NfRegistryUsersAdministration = require('nifi-registry/components/administration/users/nf-registry-users-administration.js');
var NfRegistryAddUser = require('nifi-registry/components/administration/users/dialogs/add-user/nf-registry-add-user.js');
var NfRegistryUserDetails = require('nifi-registry/components/administration/users/details/nf-registry-user-details.js');
var NfRegistryUserPermissions = require('nifi-registry/components/administration/users/permissions/nf-registry-user-permissions.js');
var NfRegistryUserGroupPermissions = require('nifi-registry/components/administration/user-group/permissions/nf-registry-user-group-permissions.js');
var NfRegistryBucketPermissions = require('nifi-registry/components/administration/workflow/buckets/permissions/nf-registry-bucket-permissions.js');
var NfRegistryWorkflowAdministration = require('nifi-registry/components/administration/workflow/nf-registry-workflow-administration.js');
var NfRegistryGridListViewer = require('nifi-registry/components/explorer/grid-list/registry/nf-registry-grid-list-viewer.js');
var NfRegistryBucketGridListViewer = require('nifi-registry/components/explorer/grid-list/registry/nf-registry-bucket-grid-list-viewer.js');
var NfRegistryDropletGridListViewer = require('nifi-registry/components/explorer/grid-list/registry/nf-registry-droplet-grid-list-viewer.js');
var fdsCore = require('@fluid-design-system/core');
var ngMoment = require('angular2-moment');
var rxjs = require('rxjs/Rx');
var fdsDialogsModule = require('@fluid-design-system/dialogs');
var ngRouter = require('@angular/router');
var ngCommonHttp = require('@angular/common/http');
var NfRegistryTokenInterceptor = require('nifi-registry/services/nf-registry.token.interceptor.js');
var NfRegistryAuthService = require('nifi-registry/services/nf-registry.auth.service.js');
var NfStorage = require('nifi-registry/services/nf-storage.service.js');

describe('NfRegistry Service isolated unit tests', function () {
    var nfRegistryService;

    beforeEach(function () {
        nfRegistryService = new NfRegistryService({}, {}, {}, {});
    });

    it('should set the breadcrumb animation state', function () {
        // The function to test
        nfRegistryService.setBreadcrumbState('test');

        //assertions
        expect(nfRegistryService.breadCrumbState).toBe('test');
    });

    it('should get the `Name (z - a)` sort by label', function () {
        //Setup the nfRegistryService state for this test
        nfRegistryService.dropletColumns[0].active = true;

        // The function to test
        var label = nfRegistryService.getSortByLabel();

        //assertions
        expect(label).toBe('Name (z - a)');
    });

    it('should get the `Name (a - z)` sort by label', function () {
        //Setup the nfRegistryService state for this test
        nfRegistryService.dropletColumns[0].active = true;
        nfRegistryService.dropletColumns[0].sortOrder = 'ASC';

        // The function to test
        var label = nfRegistryService.getSortByLabel();

        //assertions
        expect(label).toBe('Name (a - z)');
    });

    it('should get the `Oldest (update)` sort by label', function () {
        //Setup the nfRegistryService state for this test
        nfRegistryService.dropletColumns[1].active = true;

        // The function to test
        var label = nfRegistryService.getSortByLabel();

        //assertions
        expect(label).toBe('Oldest (update)');
    });

    it('should get the `Newest (update)` sort by label', function () {
        //Setup the nfRegistryService state for this test
        nfRegistryService.dropletColumns[1].active = true;
        nfRegistryService.dropletColumns[1].sortOrder = 'ASC';

        // The function to test
        var label = nfRegistryService.getSortByLabel();

        //assertions
        expect(label).toBe('Newest (update)');
    });

    it('should generate the sort menu\'s `Name (a - z)` label', function () {
        // The function to test
        var label = nfRegistryService.generateSortMenuLabels({name: 'name', label: 'Name', sortable: true});

        //assertions
        expect(label).toBe('Name (a - z)');
    });

    it('should generate the sort menu\'s `Name (z - a)` label', function () {
        // The function to test
        var label = nfRegistryService.generateSortMenuLabels({
            name: 'name',
            label: 'Name',
            sortable: true,
            sortOrder: 'ASC'
        });

        //assertions
        expect(label).toBe('Name (z - a)');
    });

    it('should generate the sort menu\'s `Newest (update)` label', function () {
        // The function to test
        var label = nfRegistryService.generateSortMenuLabels({name: 'updated', label: 'Updated', sortable: true});

        //assertions
        expect(label).toBe('Newest (update)');
    });

    it('should generate the sort menu\'s `Oldest (update)` label', function () {
        // The function to test
        var label = nfRegistryService.generateSortMenuLabels({
            name: 'updated',
            label: 'Updated',
            sortable: true,
            sortOrder: 'ASC'
        });

        //assertions
        expect(label).toBe('Oldest (update)');
    });

    it('should sort `droplets` by `column`', function () {
        //Spy
        spyOn(nfRegistryService, 'filterDroplets').and.callFake(function () {
        });

        // object to be updated by the test
        var column = {name: 'name', label: 'Name', sortable: true};

        // The function to test
        nfRegistryService.sortDroplets(column);

        //assertions
        expect(column.active).toBe(true);
        var filterDropletsCall = nfRegistryService.filterDroplets.calls.first();
        expect(filterDropletsCall.args[0]).toBe('name');
        expect(filterDropletsCall.args[1]).toBe('ASC');
        expect(nfRegistryService.activeDropletColumn).toBe(column);
    });

    it('should sort `buckets` by `column`', function () {
        //Spy
        spyOn(nfRegistryService, 'filterBuckets').and.callFake(function () {
        });

        // object to be updated by the test
        var column = {name: 'name', label: 'Bucket Name', sortable: true};

        // The function to test
        nfRegistryService.sortBuckets(column);

        //assertions
        expect(column.active).toBe(true);
        var filterBucketsCall = nfRegistryService.filterBuckets.calls.first();
        expect(filterBucketsCall.args[0]).toBe('name');
        expect(filterBucketsCall.args[1]).toBe('ASC');
    });

    it('should sort `users` and `groups` by `column`', function () {
        //Spy
        spyOn(nfRegistryService, 'filterUsersAndGroups').and.callFake(function () {
        });

        // object to be updated by the test
        var column = {
            name: 'identity',
            label: 'Display Name',
            sortable: true
        };

        // The function to test
        nfRegistryService.sortUsersAndGroups(column);

        //assertions
        expect(column.active).toBe(true);
        var filterUsersAndGroupsCall = nfRegistryService.filterUsersAndGroups.calls.first();
        expect(filterUsersAndGroupsCall.args[0]).toBe('identity');
        expect(filterUsersAndGroupsCall.args[1]).toBe('ASC');
    });

    it('should generate the auto complete options for the droplet filter.', function () {
        //Setup the nfRegistryService state for this test
        nfRegistryService.filteredDroplets = [{
            'identifier': '2e04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'name': 'Flow #1',
            'description': 'This is flow #1',
            'bucketIdentifier': '2f7f9e54-dc09-4ceb-aa58-9fe581319cdc',
            'createdTimestamp': 1505931890999,
            'modifiedTimestamp': 1505931890999,
            'type': 'FLOW',
            'snapshotMetadata': null,
            'link': {
                'params': {
                    'rel': 'self'
                },
                'href': 'flows/2e04b4fb-9513-47bb-aa74-1ae34616bfdc'
            }
        }];

        // The function to test
        nfRegistryService.getAutoCompleteDroplets();

        //assertions
        expect(nfRegistryService.autoCompleteDroplets[0]).toBe(nfRegistryService.filteredDroplets[0].name);
    });

    it('should generate the auto complete options for the bucket filter.', function () {
        //Setup the nfRegistryService state for this test
        nfRegistryService.filteredBuckets = [{
            'identifier': '2e04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'name': 'Bucket #1',
            'description': 'This is bucket #1'
        }];

        // The function to test
        nfRegistryService.getAutoCompleteBuckets();

        //assertions
        expect(nfRegistryService.autoCompleteBuckets[0]).toBe(nfRegistryService.filteredBuckets[0].name);
    });

    it('should generate the auto complete options for the users and groups filter.', function () {
        //Setup the nfRegistryService state for this test
        nfRegistryService.filteredUsers = [{
            'identifier': '2e04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'User #1'
        }];
        nfRegistryService.filteredUserGroups = [{
            'identifier': '5f04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'Group #1'
        }];

        // The function to test
        nfRegistryService.getAutoCompleteUserAndGroups();

        //assertions
        expect(nfRegistryService.autoCompleteUsersAndGroups[0]).toBe(nfRegistryService.filteredUsers[0].identity);
        expect(nfRegistryService.autoCompleteUsersAndGroups[1]).toBe(nfRegistryService.filteredUserGroups[0].identity);
    });

    it('should check if all buckets are selected and return false.', function () {
        //Setup the nfRegistryService state for this test
        nfRegistryService.filteredBuckets = [{
            'identifier': '2e04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'name': 'Bucket #1'
        }, {
            'identifier': '5c04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'name': 'Bucket #2'
        }];

        // The function to test
        var allSelected = nfRegistryService.allFilteredBucketsSelected();

        //assertions
        expect(allSelected).toBe(false);
        expect(nfRegistryService.isMultiBucketActionsDisabled).toBe(true);
    });

    it('should check if all buckets are selected and return true.', function () {
        //Setup the nfRegistryService state for this test
        nfRegistryService.filteredBuckets = [{
            'identifier': '2e04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'name': 'Bucket #1',
            'checked': true
        }, {
            'identifier': '5c04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'name': 'Bucket #2',
            'checked': true
        }];

        // The function to test
        var allSelected = nfRegistryService.allFilteredBucketsSelected();

        //assertions
        expect(allSelected).toBe(true);
        expect(nfRegistryService.isMultiBucketActionsDisabled).toBe(false);
    });

    it('should check if all users and groups are selected and return false.', function () {
        //Setup the nfRegistryService state for this test
        nfRegistryService.filteredUsers = [{
            'identifier': '2e04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'User #1'
        }, {
            'identifier': '5c04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'User #2'
        }];
        nfRegistryService.filteredUserGroups = [{
            'identifier': '2e04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'Group #1'
        }, {
            'identifier': '5c04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'Group #2'
        }];

        // The function to test
        nfRegistryService.determineAllUsersAndGroupsSelectedState();

        //assertions
        expect(nfRegistryService.allUsersAndGroupsSelected).toBe(false);
    });

    it('should check if all users and groups are selected and return true.', function () {
        //Setup the nfRegistryService state for this test
        nfRegistryService.filteredUsers = [{
            'identifier': '2e04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'User #1',
            'checked': true
        }, {
            'identifier': '5c04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'name': 'User #2',
            'checked': true
        }];
        nfRegistryService.filteredUserGroups = [{
            'identifier': '2e04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'Group #1',
            'checked': true
        }, {
            'identifier': '5c04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'Group #2',
            'checked': true
        }];

        // The function to test
        nfRegistryService.determineAllUsersAndGroupsSelectedState();

        //assertions
        expect(nfRegistryService.allUsersAndGroupsSelected).toBe(true);
    });

    it('should set the `allBucketsSelected` state to true.', function () {
        //Spy
        spyOn(nfRegistryService, 'allFilteredBucketsSelected').and.callFake(function () {
        }).and.returnValue(true);

        // The function to test
        nfRegistryService.determineAllBucketsSelectedState();

        //assertions
        expect(nfRegistryService.allBucketsSelected).toBe(true);
    });

    it('should set the `allBucketsSelected` state to false.', function () {
        //Spy
        spyOn(nfRegistryService, 'allFilteredBucketsSelected').and.callFake(function () {
        }).and.returnValue(false);

        // The function to test
        nfRegistryService.determineAllBucketsSelectedState();

        //assertions
        expect(nfRegistryService.allBucketsSelected).toBe(false);
    });

    it('should set the `allUsersAndGroupsSelected` state to true.', function () {
        //Setup the nfRegistryService state for this test
        nfRegistryService.filteredUsers = [{
            'identifier': '2e04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'User #1',
            'checked': true
        }, {
            'identifier': '5c04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'User #2',
            'checked': true
        }];
        nfRegistryService.filteredUserGroups = [{
            'identifier': '2e04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'Group #1',
            'checked': true
        }, {
            'identifier': '5c04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'Group #2',
            'checked': true
        }];

        // The function to test
        nfRegistryService.determineAllUsersAndGroupsSelectedState();

        //assertions
        expect(nfRegistryService.allUsersAndGroupsSelected).toBe(true);
    });

    it('should set the `allUsersAndGroupsSelected` state to false.', function () {
        //Setup the nfRegistryService state for this test
        nfRegistryService.filteredUsers = [{
            'identifier': '2e04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'User #1'
        }, {
            'identifier': '5c04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'User #2'
        }];
        nfRegistryService.filteredUserGroups = [{
            'identifier': '2e04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'Group #1'
        }, {
            'identifier': '5c04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'Group #2'
        }];

        // The function to test
        nfRegistryService.determineAllUsersAndGroupsSelectedState();

        //assertions
        expect(nfRegistryService.allUsersAndGroupsSelected).toBe(false);
    });

    it('should toggle all bucket `checked` properties to true.', function () {
        //Spy
        spyOn(nfRegistryService, 'selectAllBuckets').and.callFake(function () {
        });

        nfRegistryService.allBucketsSelected = true;

        // The function to test
        nfRegistryService.toggleBucketsSelectAll();

        //assertions
        expect(nfRegistryService.selectAllBuckets).toHaveBeenCalled();
    });

    it('should toggle all bucket `checked` properties to false.', function () {
        //Spy
        spyOn(nfRegistryService, 'deselectAllBuckets').and.callFake(function () {
        });

        nfRegistryService.allBucketsSelected = false;

        // The function to test
        nfRegistryService.toggleBucketsSelectAll();

        //assertions
        expect(nfRegistryService.deselectAllBuckets).toHaveBeenCalled();
    });

    it('should toggle all user and group `checked` properties to true.', function () {
        //Spy
        spyOn(nfRegistryService, 'selectAllUsersAndGroups').and.callFake(function () {
        });

        nfRegistryService.allUsersAndGroupsSelected = true;

        // The function to test
        nfRegistryService.toggleUsersSelectAll();

        //assertions
        expect(nfRegistryService.selectAllUsersAndGroups).toHaveBeenCalled();
    });

    it('should toggle all user and group `checked` properties to false.', function () {
        //Spy
        spyOn(nfRegistryService, 'deselectAllUsersAndGroups').and.callFake(function () {
        });

        nfRegistryService.allUsersAndGroupsSelected = false;

        // The function to test
        nfRegistryService.toggleUsersSelectAll();

        //assertions
        expect(nfRegistryService.deselectAllUsersAndGroups).toHaveBeenCalled();
    });

    it('should select all buckets.', function () {
        nfRegistryService.filteredBuckets = [{identifier: 1}];

        // The function to test
        nfRegistryService.selectAllBuckets();

        //assertions
        expect(nfRegistryService.filteredBuckets[0].checked).toBe(true);
        expect(nfRegistryService.isMultiBucketActionsDisabled).toBe(false);
    });

    it('should deselect all buckets.', function () {
        nfRegistryService.filteredBuckets = [{identifier: 1, checked: true}];

        // The function to test
        nfRegistryService.deselectAllBuckets();

        //assertions
        expect(nfRegistryService.filteredBuckets[0].checked).toBe(false);
        expect(nfRegistryService.isMultiBucketActionsDisabled).toBe(true);
    });

    it('should select all users and groups.', function () {
        //Setup the nfRegistryService state for this test
        nfRegistryService.filteredUsers = [{
            'identifier': '2e04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'User #1'
        }, {
            'identifier': '5c04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'User #2'
        }];
        nfRegistryService.filteredUserGroups = [{
            'identifier': '2e04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'Group #1'
        }, {
            'identifier': '5c04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'Group #2'
        }];

        // The function to test
        nfRegistryService.selectAllUsersAndGroups();

        //assertions
        expect(nfRegistryService.filteredUsers[0].checked).toBe(true);
        expect(nfRegistryService.filteredUsers[1].checked).toBe(true);
        expect(nfRegistryService.filteredUserGroups[0].checked).toBe(true);
        expect(nfRegistryService.filteredUserGroups[1].checked).toBe(true);
        expect(nfRegistryService.allUsersAndGroupsSelected).toBe(true);
    });

    it('should deselect all users and groups.', function () {
        //Setup the nfRegistryService state for this test
        nfRegistryService.filteredUsers = [{
            'identifier': '2e04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'User #1',
            checked: true
        }, {
            'identifier': '5c04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'User #2',
            checked: true
        }];
        nfRegistryService.filteredUserGroups = [{
            'identifier': '2e04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'Group #1',
            checked: true
        }, {
            'identifier': '5c04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'Group #2',
            checked: true
        }];

        // The function to test
        nfRegistryService.deselectAllUsersAndGroups();

        //assertions
        expect(nfRegistryService.filteredUsers[0].checked).toBe(false);
        expect(nfRegistryService.filteredUsers[1].checked).toBe(false);
        expect(nfRegistryService.filteredUserGroups[0].checked).toBe(false);
        expect(nfRegistryService.filteredUserGroups[1].checked).toBe(false);
        expect(nfRegistryService.allUsersAndGroupsSelected).toBe(false);
    });

    it('should add a bucket search term.', function () {
        //Spy
        spyOn(nfRegistryService, 'filterBuckets').and.callFake(function () {
        });

        // The function to test
        nfRegistryService.bucketsSearchAdd('Bucket #1');

        //assertions
        expect(nfRegistryService.bucketsSearchTerms.length).toBe(1);
        expect(nfRegistryService.bucketsSearchTerms[0]).toBe('Bucket #1');
        expect(nfRegistryService.filterBuckets).toHaveBeenCalled();
    });

    it('should remove a bucket search term.', function () {
        //Spy
        spyOn(nfRegistryService, 'filterBuckets').and.callFake(function () {
        });

        //set up the state
        nfRegistryService.bucketsSearchTerms = ['Bucket #1'];

        // The function to test
        nfRegistryService.bucketsSearchRemove('Bucket #1');

        //assertions
        expect(nfRegistryService.bucketsSearchTerms.length).toBe(0);
        expect(nfRegistryService.filterBuckets).toHaveBeenCalled();
    });

    it('should add a user/group search term.', function () {
        //Spy
        spyOn(nfRegistryService, 'filterUsersAndGroups').and.callFake(function () {
        });
        spyOn(nfRegistryService, 'determineAllUsersAndGroupsSelectedState').and.callFake(function () {
        });

        // The function to test
        nfRegistryService.usersSearchAdd('Group #1');

        //assertions
        expect(nfRegistryService.usersSearchTerms.length).toBe(1);
        expect(nfRegistryService.usersSearchTerms[0]).toBe('Group #1');
        expect(nfRegistryService.filterUsersAndGroups).toHaveBeenCalled();
        expect(nfRegistryService.determineAllUsersAndGroupsSelectedState).toHaveBeenCalled();
    });

    it('should remove a user/group search term.', function () {
        //Spy
        spyOn(nfRegistryService, 'filterUsersAndGroups').and.callFake(function () {
        });
        spyOn(nfRegistryService, 'determineAllUsersAndGroupsSelectedState').and.callFake(function () {
        });

        //set up the state
        nfRegistryService.usersSearchTerms = ['Group #1'];

        // The function to test
        nfRegistryService.usersSearchRemove('Group #1');

        //assertions
        expect(nfRegistryService.usersSearchTerms.length).toBe(0);
        expect(nfRegistryService.filterUsersAndGroups).toHaveBeenCalled();
        expect(nfRegistryService.determineAllUsersAndGroupsSelectedState).toHaveBeenCalled();
    });

    it('should get the selected user and group counts.', function () {
        //Setup the nfRegistryService state for this test
        nfRegistryService.filteredUsers = [{
            'identifier': '2e04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'User #1',
            checked: true
        }, {
            'identifier': '5c04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'User #2',
            checked: true
        }];
        nfRegistryService.filteredUserGroups = [{
            'identifier': '2e04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'Group #1',
            checked: true
        }, {
            'identifier': '5c04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'Group #2',
            checked: true
        }];

        // The function to test
        var selectedGroups = nfRegistryService.getSelectedGroups();
        var selectedUsers = nfRegistryService.getSelectedUsers();

        //assertions
        expect(selectedUsers.length).toBe(2);
        expect(selectedGroups.length).toBe(2);
    });
});

describe('NfRegistry Service w/ Angular testing utils', function () {
    var nfRegistryService;
    var nfRegistryApi;

    beforeEach(function () {
        ngCoreTesting.TestBed.configureTestingModule({
            imports: [
                ngMoment.MomentModule,
                ngCommonHttp.HttpClientModule,
                fdsCore,
                NfRegistryRoutes,
                ngCommonHttpTesting.HttpClientTestingModule
            ],
            declarations: [
                FdsDemo,
                NfRegistry,
                NfRegistryExplorer,
                NfRegistryAdministration,
                NfRegistryUsersAdministration,
                NfRegistryUserDetails,
                NfRegistryUserPermissions,
                NfRegistryUserGroupPermissions,
                NfRegistryBucketPermissions,
                NfRegistryAddUser,
                NfRegistryWorkflowAdministration,
                NfRegistryGridListViewer,
                NfRegistryBucketGridListViewer,
                NfRegistryDropletGridListViewer,
                NfPageNotFoundComponent
            ],
            providers: [
                NfRegistryService,
                NfRegistryAuthService,
                NfRegistryApi,
                NfStorage,
                {
                    provide: ngCommonHttp.HTTP_INTERCEPTORS,
                    useClass: NfRegistryTokenInterceptor,
                    multi: true
                },
                {
                    provide: ngCommon.APP_BASE_HREF,
                    useValue: '/'
                }
            ],
            bootstrap: [NfRegistry]
        });
        // from the root injector
        nfRegistryService = ngCoreTesting.TestBed.get(NfRegistryService);
        nfRegistryApi = ngCoreTesting.TestBed.get(NfRegistryApi);

        // Spy
        spyOn(nfRegistryApi.http, 'get').and.callFake(function () {
        });
        spyOn(nfRegistryApi.http, 'post').and.callFake(function () {
        });
        spyOn(nfRegistryApi, 'ticketExchange').and.callFake(function () {
        }).and.returnValue(rxjs.Observable.of({}));
        spyOn(nfRegistryService, 'loadCurrentUser').and.callFake(function () {
        }).and.returnValue(rxjs.Observable.of({}));
    });

    it('should retrieve the snapshot metadata for the given droplet.', function () {
        //Spy
        spyOn(nfRegistryApi, 'getDropletSnapshotMetadata').and.callFake(function () {
        }).and.returnValue(rxjs.Observable.of([{
            version: 999
        }]));

        // object to be updated by the test
        var droplet = {link: {href: 'test/id'}};

        // The function to test
        nfRegistryService.getDropletSnapshotMetadata(droplet);

        //assertions
        expect(droplet.snapshotMetadata[0].version).toBe(999);
        expect(nfRegistryApi.getDropletSnapshotMetadata).toHaveBeenCalled();
        expect(nfRegistryApi.getDropletSnapshotMetadata.calls.count()).toBe(1);
        var getDropletSnapshotMetadataCall = nfRegistryApi.getDropletSnapshotMetadata.calls.first()
        expect(getDropletSnapshotMetadataCall.args[0]).toBe('test/id');
        expect(getDropletSnapshotMetadataCall.args[1]).toBe(true);
    });

    it('should execute the `delete` droplet action.', function () {
        //Setup the nfRegistryService state for this test
        nfRegistryService.droplets = [{identifier: '2e04b4fb-9513-47bb-aa74-1ae34616bfdc'}];

        //Spy
        spyOn(nfRegistryService.dialogService, 'openConfirm').and.returnValue({
            afterClosed: function () {
                return rxjs.Observable.of(true);
            }
        });
        spyOn(nfRegistryApi, 'deleteDroplet').and.callFake(function () {
        }).and.returnValue(rxjs.Observable.of({identifier: '2e04b4fb-9513-47bb-aa74-1ae34616bfdc', link: null}));
        spyOn(nfRegistryService, 'filterDroplets').and.callFake(function () {
        });

        // The function to test
        nfRegistryService.executeDropletAction({name: 'delete'}, {
            identifier: '2e04b4fb-9513-47bb-aa74-1ae34616bfdc',
            type: 'testTYPE',
            link: {href: 'testhref'}
        });

        //assertions
        expect(nfRegistryService.droplets.length).toBe(0);
        expect(nfRegistryService.filterDroplets).toHaveBeenCalled();
        var openConfirmCall = nfRegistryService.dialogService.openConfirm.calls.first()
        expect(openConfirmCall.args[0].title).toBe('Delete testtype');
        var deleteDropletCall = nfRegistryApi.deleteDroplet.calls.first()
        expect(deleteDropletCall.args[0]).toBe('testhref');
    });

    it('should filter droplets by name.', function () {
        //Setup the nfRegistryService state for this test
        nfRegistryService.dropletsSearchTerms = ['Flow #1'];
        nfRegistryService.droplets = [{
            'identifier': '2e04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'name': 'Flow #1',
            'description': 'This is flow #1',
            'bucketIdentifier': '2f7f9e54-dc09-4ceb-aa58-9fe581319cdc',
            'createdTimestamp': 1505931890999,
            'modifiedTimestamp': 1505931890999,
            'type': 'FLOW',
            'snapshotMetadata': null,
            'link': {
                'params': {
                    'rel': 'self'
                },
                'href': 'flows/2e04b4fb-9513-47bb-aa74-1ae34616bfdc'
            }
        }, {
            'identifier': '5d04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'name': 'Flow #2',
            'description': 'This is flow #2',
            'bucketIdentifier': '3g7f9e54-dc09-4ceb-aa58-9fe581319cdc',
            'createdTimestamp': 1505931890999,
            'modifiedTimestamp': 1505931890999,
            'type': 'FLOW',
            'snapshotMetadata': null,
            'link': {
                'params': {
                    'rel': 'self'
                },
                'href': 'flows/5d04b4fb-9513-47bb-aa74-1ae34616bfdc'
            }
        }];

        //Spy
        spyOn(nfRegistryService, 'getAutoCompleteDroplets');

        // The function to test
        nfRegistryService.filterDroplets();

        //assertions
        expect(nfRegistryService.filteredDroplets.length).toBe(1);
        expect(nfRegistryService.filteredDroplets[0].name).toBe('Flow #1');
        expect(nfRegistryService.getAutoCompleteDroplets).toHaveBeenCalled();
    });

    it('should filter droplets by `type:flow` (demonstrate ability to do advanced searching of a droplet by a property `name:value` pair).', function () {
        //Setup the nfRegistryService state for this test
        nfRegistryService.dropletsSearchTerms = ['type:FLOW'];
        nfRegistryService.droplets = [{
            'identifier': '2e04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'name': 'Flow #1',
            'description': 'This is flow #1',
            'bucketIdentifier': '2f7f9e54-dc09-4ceb-aa58-9fe581319cdc',
            'createdTimestamp': 1505931890999,
            'modifiedTimestamp': 1505931890999,
            'type': 'FLOW',
            'snapshotMetadata': null,
            'link': {
                'params': {
                    'rel': 'self'
                },
                'href': 'flows/2e04b4fb-9513-47bb-aa74-1ae34616bfdc'
            }
        }, {
            'identifier': '5d04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'name': 'Flow #2',
            'description': 'This is not a flow #2',
            'bucketIdentifier': '3g7f9e54-dc09-4ceb-aa58-9fe581319cdc',
            'createdTimestamp': 1505931890999,
            'modifiedTimestamp': 1505931890999,
            'type': 'something',
            'snapshotMetadata': null,
            'link': {
                'params': {
                    'rel': 'self'
                },
                'href': 'flows/5d04b4fb-9513-47bb-aa74-1ae34616bfdc'
            }
        }];

        //Spy
        spyOn(nfRegistryService, 'getAutoCompleteDroplets');

        // The function to test
        nfRegistryService.filterDroplets();

        //assertions
        expect(nfRegistryService.filteredDroplets.length).toBe(1);
        expect(nfRegistryService.filteredDroplets[0].name).toBe('Flow #1');
        expect(nfRegistryService.getAutoCompleteDroplets).toHaveBeenCalled();
    });

    it('should execute a `delete` action on a bucket.', function () {
        // from the root injector
        var dialogService = ngCoreTesting.TestBed.get(fdsDialogsModule.FdsDialogService);

        //Spy
        spyOn(nfRegistryService, 'filterBuckets').and.callFake(function () {
        });
        spyOn(dialogService, 'openConfirm').and.callFake(function () {
        }).and.returnValue({
            afterClosed: function () {
                return rxjs.Observable.of(true);
            }
        });
        spyOn(nfRegistryApi, 'deleteBucket').and.callFake(function () {
        }).and.returnValue(rxjs.Observable.of({identifier: '2e04b4fb-9513-47bb-aa74-1ae34616bfdc', link: null}));

        // object to be updated by the test
        var bucket = {identifier: '999'};

        // set up the bucket to be deleted
        nfRegistryService.buckets = [bucket, {identifier: 1}];

        // The function to test
        nfRegistryService.executeBucketAction({name: 'delete'}, bucket);

        //assertions
        expect(dialogService.openConfirm).toHaveBeenCalled();
        expect(nfRegistryApi.deleteBucket).toHaveBeenCalled();
        expect(nfRegistryService.filterBuckets).toHaveBeenCalled();
        expect(nfRegistryService.buckets.length).toBe(1);
        expect(nfRegistryService.buckets[0].identifier).toBe(1);
    });

    it('should execute a `permissions` action on a bucket.', function () {
        // from the root injector
        var router = ngCoreTesting.TestBed.get(ngRouter.Router);

        //Spy
        spyOn(router, 'navigateByUrl').and.callFake(function () {
        });

        // object to be updated by the test
        var bucket = {identifier: '999'};

        // The function to test
        nfRegistryService.executeBucketAction({name: 'permissions', type: 'sidenav'}, bucket);

        //assertions
        var navigateByUrlCall = router.navigateByUrl.calls.first();
        expect(navigateByUrlCall.args[0]).toBe('/nifi-registry/administration/workflow(sidenav:bucket/permissions/999)');
    });

    it('should execute a `delete` action on a user.', function () {
        // from the root injector
        var dialogService = ngCoreTesting.TestBed.get(fdsDialogsModule.FdsDialogService);

        //Spy
        spyOn(nfRegistryService, 'filterUsersAndGroups').and.callFake(function () {
        });
        spyOn(dialogService, 'openConfirm').and.callFake(function () {
        }).and.returnValue({
            afterClosed: function () {
                return rxjs.Observable.of(true);
            }
        });
        spyOn(nfRegistryApi, 'deleteUser').and.callFake(function () {
        }).and.returnValue(rxjs.Observable.of({identifier: '2e04b4fb-9513-47bb-aa74-1ae34616bfdc', link: null}));

        // object to be updated by the test
        var user = {identifier: '999'};

        // set up the user to be deleted
        nfRegistryService.users = [user, {identifier: 1}];

        // The function to test
        nfRegistryService.executeUserAction({name: 'delete'}, user);

        //assertions
        expect(dialogService.openConfirm).toHaveBeenCalled();
        expect(nfRegistryApi.deleteUser).toHaveBeenCalled();
        expect(nfRegistryService.filterUsersAndGroups).toHaveBeenCalled();
        expect(nfRegistryService.users.length).toBe(1);
        expect(nfRegistryService.users[0].identifier).toBe(1);
    });

    it('should execute a `permissions` action on a user.', function () {
        // from the root injector
        var router = ngCoreTesting.TestBed.get(ngRouter.Router);

        //Spy
        spyOn(router, 'navigateByUrl').and.callFake(function () {
        });

        // object to be updated by the test
        var user = {identifier: '999'};

        // The function to test
        nfRegistryService.executeUserAction({name: 'permissions', type: 'sidenav'}, user);

        //assertions
        var navigateByUrlCall = router.navigateByUrl.calls.first();
        expect(navigateByUrlCall.args[0]).toBe('/nifi-registry/administration/users(sidenav:user/permissions/999)');
    });

    it('should execute a `delete` action on a group.', function () {
        // from the root injector
        var dialogService = ngCoreTesting.TestBed.get(fdsDialogsModule.FdsDialogService);

        //Spy
        spyOn(nfRegistryService, 'filterUsersAndGroups').and.callFake(function () {
        });
        spyOn(dialogService, 'openConfirm').and.callFake(function () {
        }).and.returnValue({
            afterClosed: function () {
                return rxjs.Observable.of(true);
            }
        });
        spyOn(nfRegistryApi, 'deleteUserGroup').and.callFake(function () {
        }).and.returnValue(rxjs.Observable.of({identifier: '2e04b4fb-9513-47bb-aa74-1ae34616bfdc', link: null}));

        // object to be updated by the test
        var group = {identifier: '999'};

        // set up the user to be deleted
        nfRegistryService.groups = [group, {identifier: 1}];

        // The function to test
        nfRegistryService.executeGroupAction({name: 'delete'}, group);

        //assertions
        expect(dialogService.openConfirm).toHaveBeenCalled();
        expect(nfRegistryApi.deleteUserGroup).toHaveBeenCalled();
        expect(nfRegistryService.filterUsersAndGroups).toHaveBeenCalled();
        expect(nfRegistryService.groups.length).toBe(1);
        expect(nfRegistryService.groups[0].identifier).toBe(1);
    });

    it('should execute a `permissions` action on a group.', function () {
        // from the root injector
        var router = ngCoreTesting.TestBed.get(ngRouter.Router);

        //Spy
        spyOn(router, 'navigateByUrl').and.callFake(function () {
        });

        // object to be updated by the test
        var group = {identifier: '999'};

        // The function to test
        nfRegistryService.executeGroupAction({name: 'permissions', type: 'sidenav'}, group);

        //assertions
        var navigateByUrlCall = router.navigateByUrl.calls.first();
        expect(navigateByUrlCall.args[0]).toBe('/nifi-registry/administration/users(sidenav:group/permissions/999)');
    });

    it('should filter buckets by name.', function () {
        //Setup the nfRegistryService state for this test
        nfRegistryService.bucketsSearchTerms = ['Bucket #1'];
        nfRegistryService.buckets = [{
            'identifier': '2e04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'name': 'Bucket #1',
            'description': 'This is bucket #1',
            'checked': true
        }, {
            'identifier': '5d04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'name': 'Bucket #2',
            'description': 'This is bucket #2',
            'checked': true
        }];

        //Spy
        spyOn(nfRegistryService, 'getAutoCompleteBuckets');

        //assertion
        expect(nfRegistryService.isMultiBucketActionsDisabled).toBe(true);

        // The function to test
        nfRegistryService.filterBuckets();

        //assertions
        expect(nfRegistryService.filteredBuckets.length).toBe(1);
        expect(nfRegistryService.filteredBuckets[0].name).toBe('Bucket #1');
        expect(nfRegistryService.getAutoCompleteBuckets).toHaveBeenCalled();
        expect(nfRegistryService.isMultiBucketActionsDisabled).toBe(false);
    });

    it('should filter users and groups by name.', function () {
        //Setup the nfRegistryService state for this test
        nfRegistryService.usersSearchTerms = ['Group #1'];
        nfRegistryService.users = [{
            'identifier': '2e04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'User #1',
            'description': 'This is user #1',
            'checked': true
        }, {
            'identifier': '5d04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'User #2',
            'description': 'This is user #2',
            'checked': true
        }];
        nfRegistryService.groups = [{
            'identifier': '2e04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'Group #1',
            'description': 'This is group #1',
            'checked': true
        }, {
            'identifier': '5d04b4fb-9513-47bb-aa74-1ae34616bfdc',
            'identity': 'Group #2',
            'description': 'This is group #2',
            'checked': true
        }];

        //Spy
        spyOn(nfRegistryService, 'getAutoCompleteUserAndGroups');

        // The function to test
        nfRegistryService.filterUsersAndGroups();

        //assertions
        expect(nfRegistryService.filteredUsers.length).toBe(0);
        expect(nfRegistryService.filteredUserGroups.length).toBe(1);
        expect(nfRegistryService.filteredUserGroups[0].identity).toBe('Group #1');
        expect(nfRegistryService.getAutoCompleteUserAndGroups).toHaveBeenCalled();
    });

    it('should delete all selected buckets.', function () {
        // from the root injector
        var dialogService = ngCoreTesting.TestBed.get(fdsDialogsModule.FdsDialogService);

        //Spy
        spyOn(nfRegistryService, 'filterBuckets').and.callFake(function () {
        });
        spyOn(nfRegistryService, 'determineAllBucketsSelectedState').and.callFake(function () {
        });
        spyOn(dialogService, 'openConfirm').and.callFake(function () {
        }).and.returnValue({
            afterClosed: function () {
                return rxjs.Observable.of(true);
            }
        });
        spyOn(nfRegistryApi, 'deleteBucket').and.callFake(function () {
        }).and.returnValue(rxjs.Observable.of({identifier: 999, link: null}));

        // object to be updated by the test
        var bucket = {identifier: 999, checked: true};

        // set up the bucket to be deleted
        nfRegistryService.buckets = nfRegistryService.filteredBuckets = [bucket, {identifier: 1}];

        // The function to test
        nfRegistryService.deleteSelectedBuckets();

        //assertions
        expect(dialogService.openConfirm).toHaveBeenCalled();
        expect(nfRegistryApi.deleteBucket).toHaveBeenCalled();
        expect(nfRegistryApi.deleteBucket.calls.count()).toBe(1);
        expect(nfRegistryService.filterBuckets).toHaveBeenCalled();
        expect(nfRegistryService.filterBuckets.calls.count()).toBe(1);
        expect(nfRegistryService.isMultiBucketActionsDisabled).toBe(true);
        expect(nfRegistryService.allBucketsSelected).toBe(false);
        expect(nfRegistryService.buckets.length).toBe(1);
        expect(nfRegistryService.buckets[0].identifier).toBe(1);
    });

    it('should delete all selected users and groups.', function () {
        // from the root injector
        var dialogService = ngCoreTesting.TestBed.get(fdsDialogsModule.FdsDialogService);

        //Spy
        spyOn(nfRegistryService, 'filterUsersAndGroups').and.callFake(function () {
        });
        spyOn(nfRegistryService, 'determineAllUsersAndGroupsSelectedState').and.callFake(function () {
        });
        spyOn(dialogService, 'openConfirm').and.callFake(function () {
        }).and.returnValue({
            afterClosed: function () {
                return rxjs.Observable.of(true);
            }
        });
        spyOn(nfRegistryApi, 'deleteUserGroup').and.callFake(function () {
        }).and.returnValue(rxjs.Observable.of({identifier: 999, link: null}));
        spyOn(nfRegistryApi, 'deleteUser').and.callFake(function () {
        }).and.returnValue(rxjs.Observable.of({identifier: 99, link: null}));

        // object to be updated by the test
        var group = {identifier: 999, checked: true};
        var user = {identifier: 999, checked: true};

        // set up the group to be deleted
        nfRegistryService.groups = nfRegistryService.filteredUserGroups = [group, {identifier: 1}];
        nfRegistryService.users = nfRegistryService.filteredUsers = [user, {identifier: 12}];

        // The function to test
        nfRegistryService.deleteSelectedUsersAndGroups();

        //assertions
        expect(dialogService.openConfirm).toHaveBeenCalled();
        expect(nfRegistryApi.deleteUserGroup).toHaveBeenCalled();
        expect(nfRegistryApi.deleteUserGroup.calls.count()).toBe(1);
        expect(nfRegistryApi.deleteUser).toHaveBeenCalled();
        expect(nfRegistryApi.deleteUser.calls.count()).toBe(1);
        expect(nfRegistryService.filterUsersAndGroups).toHaveBeenCalled();
        expect(nfRegistryService.filterUsersAndGroups.calls.count()).toBe(2);
        expect(nfRegistryService.allBucketsSelected).toBe(false);
        expect(nfRegistryService.groups.length).toBe(1);
        expect(nfRegistryService.groups[0].identifier).toBe(1);
        expect(nfRegistryService.users.length).toBe(1);
        expect(nfRegistryService.users[0].identifier).toBe(12);
    });
});