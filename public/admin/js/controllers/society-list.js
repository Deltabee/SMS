
socialApp.controller('societyList',['$scope', '$http', '$location', '$compile','$route', '$timeout', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $http,$location, $compile, $route, $timeout,DTOptionsBuilder,DTColumnBuilder) {

	       
		$scope.dtColumns = [
            //here We will add .withOption('name','column_name') for send column name to the server 
            DTColumnBuilder.newColumn("logo_img", "Logo Image").notSortable(),
            DTColumnBuilder.newColumn("name", "Name").notSortable(),
            DTColumnBuilder.newColumn("established_date", "Establish Date").notSortable(),
            DTColumnBuilder.newColumn("owner", "Owner").notSortable(),
            DTColumnBuilder.newColumn("chair_person", "Chairman").notSortable(),
            DTColumnBuilder.newColumn("secretary", "Secretary").notSortable(),
            DTColumnBuilder.newColumn("treasurer", "Treasurer").notSortable(),
            DTColumnBuilder.newColumn("manager_name", "Manager").notSortable(),
            DTColumnBuilder.newColumn(null, "Action").notSortable().renderWith(actionsHtml)
        ]
 
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            contentType: "application/json;",
            url:"/getsocietyList",
            type:"GET",
            dataSrc: function (res) { 

            	var log = []; 
                var generateResponse = JSON.parse(res.success);
                angular.forEach(generateResponse,function(item,index){
                    item.logo_img = '<img src="uploads/'+item.general_img+'" width="100px"/>';
                    log.push(item);
                });
                return log;
      		}
        })
        .withOption('processing', true) //for show progress bar
        .withOption('serverSide', true) // for server side processing
        .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
        .withDisplayLength(10) // Page size
        .withOption('aaSorting',[0,'asc'])
         .withOption('responsive', true)
        .withOption('createdRow', createdRow);

        function createdRow(row, data, dataIndex) {
        
            $compile(angular.element(row).contents())($scope);
        }
        function actionsHtml(data, type, full, meta) {
            $d = full;
            var str = '<a href="#/society/'+$d.slug+'" title="Preview" target="_blank"><i class="fa fa-eye"></i></a> | <a href="javascript:void(0)" ng-click="deleteSociety('+$d.id+')" title="Delete"><i class="fa fa-trash"></i></a>';
            if($d.has_blocks==1){
                str +=' | <a href="#/add-blocks/'+$d.id+'" title="Add More Blocks"><i class="fa fa-plus"></i></a>';
                str += ' | <a href="#/block-list/'+$d.id+'" title="View Blocks"><i class="fa fa-building-o" aria-hidden="true"></i></a>';
            }
            
            return str;
        }
       
		$scope.deleteSociety = function(id){
			var url = '/deleteSociety';
			$http.post(url, {id: id}).success(function(response){
                
                if(response.success){
                    $route.reload();
                }else{
                    alert(response.error);
                }
				
			});
		}
}]);

socialApp.controller('societyListByID',['$scope', '$http', '$location', '$compile','$route', '$timeout','$routeParams', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $http,$location, $compile, $route, $timeout, $routeParams, DTOptionsBuilder, DTColumnBuilder) {
        var id = window.atob($routeParams.id);
        $scope.societyDetails = {};
        
        $scope.block = {};
        $http.post('/getSocietyDetail', {id: id}).success(function(response){
            if (response.success) {
                $scope.societyDetails = JSON.parse(response.success);
                
                $scope.block.parent_id = window.btoa($scope.societyDetails.id);
            }else{
                $location.path('/404');
            }
        });
        $scope.dtColumns = [
            DTColumnBuilder.newColumn("name", "Name").notSortable(),
            DTColumnBuilder.newColumn("society_name", "Society").notSortable(),
            DTColumnBuilder.newColumn("description", "Description").notSortable(),
            DTColumnBuilder.newColumn("storeys", "Number of Storeys").notSortable(),
            DTColumnBuilder.newColumn("num_of_flats", "Number of Flats").notSortable(),
            DTColumnBuilder.newColumn("manager_name", "Manager").notSortable(),
            DTColumnBuilder.newColumn(null, "Action").notSortable().renderWith(actionsHtml)
        ]
 
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            contentType: "application/json;",
            url:"/getblockList",
            type:"GET",
            data: function(d){
                d.id = id;
            },
            dataSrc: function (res) { 
                var generateResponse = JSON.parse(res.success);
                return generateResponse;
            }
        })
        .withOption('processing', true) //for show progress bar
        .withOption('serverSide', true) // for server side processing
        .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
        .withDisplayLength(10) // Page size
        .withOption('aaSorting',[0,'asc'])
         .withOption('responsive', true)
        .withOption('createdRow', createdRow);

        function createdRow(row, data, dataIndex) {
        
            $compile(angular.element(row).contents())($scope);
        }
        function actionsHtml(data, type, full, meta) {
            $d = full;
            return '<a href="#/block/'+$d.society_slug+'/'+$d.slug+'" title="Preview" target="_blank"><i class="fa fa-eye"></i></a> | <a href="javascript:void(0)" ng-click="deleteBlock('+$d.id+')" title="Delete"><i class="fa fa-trash"></i></a>';
            /* | <a href="#/manager-edit-block" title="Edit"><i class="fa fa-edit"></i></a> */ 
        }
        
        $scope.deleteBlock = function(id){
            var url = '/deleteBlock';
            $http.post(url, {id: id}).success(function(response){
                $route.reload();
            });
        }
        $scope.deleteSociety = function(id){
            var url = '/deleteSociety';
            $http.post(url, {id: id}).success(function(response){
                if(response.success){
                    $route.reload();
                }else{
                    alert(response.error);
                }
                
            });
        }
}]);