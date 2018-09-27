var app = angular.module("ZabbixMonitor", ["chart.js"]);
app.controller("ZabCtrl", function($scope,$http) {
    
	 $scope.auth="";
	 $scope.item=0;
	 var doman= "http://domain.com" // put your domain name or IP here Ex: http://172.212.247.11
	var url = doman+"/zabbix/api_jsonrpc.php";
	
	var parameter ={jsonrpc: "2.0",method: "user.login",params: {user: "Your Name HEAR",password: "Your PASS WORD HERE"},id: 3,auth: null};
	   $http.post(url, parameter,{headers: {'Content-Type': 'application/json'}} ).
	   then(function(data, status, headers, config) {
		$scope.auth = data.data.result;
		$scope.gethost();
		//$scope.getItems(10107);
		//
		//
      });
	  //get all Serveur 
	  $scope.gethost =function(){
		  var p = {jsonrpc: "2.0",method: "host.get",auth:$scope.auth,id: 2,params:{output: ["hostid","host"],selectInterfaces: ["interfaceid","ip"]}};
		   $http.post(url, p,{headers: {'Content-Type': 'application/json'}} ).
			then(function(data, status, headers, config) {
				$scope.hosts = data.data.result;				
				// console.log($scope.hosts);
			});
		  }	  
		//Load all graph
		$scope.LoadGraph =function(selecthost){
				$scope.cpu_list(selecthost);
				$scope.memory_list(selecthost);
				$scope.disk_list(selecthost);
				$scope.cpu_top(selecthost);
					//* $scope.event_list(selecthost);
				$scope.cpu_average1(selecthost);
				$scope.cpu_average2(selecthost);
				$scope.cpu_average3(selecthost);
				
				$scope.cpu_services(selecthost);
				$scope.trafic(selecthost);
			}
		$scope.getItems =function(hostid,key){			
			return p ={
					jsonrpc: "2.0",
					method: "item.get",
					params: {
						output: ["name", "key_", "value_type", "hostid", "status", "state"],
						hostids: hostid,
						filter:{key_: key}
					},
					auth: $scope.auth,
					id: 1
				};
					 
			}		;
 
	 
		$scope.cpu_services =function(hostid){
				
			$scope.service= {
				DNS:['net.tcp.listen[53]',0,53],
				FTP:['net.tcp.listen[21]',0,21],
				TCP:['net.tcp.listen[2525]',0,2525],
				HTTP:['net.tcp.listen[8080]',0,8080],
				MYSQL:['net.tcp.listen[3306]',0,3306],
				SUPERVISORD:['net.tcp.listen[9001]',0,9001 ],
				virtualmin:['net.tcp.listen[10000]',0,10000],
				gearman:['net.tcp.listen[4730]',0,4730],
				SSH:['net.tcp.listen[22]',0,22]
				};
			
			angular.forEach($scope.service, function(value, key) {
			console.log(value);
				 $scope.cpu_service (hostid,key,value[0]);
			});
		}
		$scope.cpu_service =function(hostid,name,tag){
			console.log(hostid+name+tag);
			var p1 = $scope.getItems(hostid,tag);
			$http.post(url, p1,{headers: {'Content-Type': 'application/json'}} ).
					then(function(data, status, headers, config) {
						if(data.data.result.length == 0){return ;}
						$scope.item = data.data.result[0].itemid;
						var p ={
								jsonrpc: "2.0",
								method: "history.get",
								params: {
									output: "extend",
									history: 3,
									itemids: $scope.item ,
									sortfield: "clock",
									sortorder:'DESC',
									 limit: 1
								},
								auth: $scope.auth,
								id: 4
							};				  
							$http.post(url, p,{headers: {'Content-Type': 'application/json'}}).
							then(function(data2, status, headers, config) {
									console.log($scope.service);
									$scope.service[name][1]=data2.data.result[0].value;
							});
					});
		}
		$scope.cpu_average1 =function(hostid){
			//net.tcp.service
			$scope.average1= 0;
			var p1 = $scope.getItems(hostid,'system.cpu.load[percpu,avg1]');
			$http.post(url, p1,{headers: {'Content-Type': 'application/json'}} ).
					then(function(data, status, headers, config) {
						if(data.data.result.length == 0){return ;}
						$scope.item = data.data.result[0].itemid;
						var p ={
								jsonrpc: "2.0",
								method: "history.get",
								params: {
									output: "extend",
									history: 0,
									itemids: $scope.item ,
									sortfield: "clock",
									sortorder:'DESC',
									 limit: 1
								},
								auth: $scope.auth,
								id: 1
							};				  
							$http.post(url, p,{headers: {'Content-Type': 'application/json'}}).
							then(function(data2, status, headers, config) {
									$scope.average1 = data2.data.result[0].value;
							});
					});
		}
		$scope.cpu_average2 =function(hostid){
			//net.tcp.service
			$scope.average= 0;
			var p1 = $scope.getItems(hostid,'system.cpu.load[percpu,avg5]');
			$http.post(url, p1,{headers: {'Content-Type': 'application/json'}} ).
					then(function(data, status, headers, config) {
						if(data.data.result.length == 0){return ;}
						$scope.item = data.data.result[0].itemid;
						var p ={
								jsonrpc: "2.0",
								method: "history.get",
								params: {
									output: "extend",
									history: 0,
									itemids: $scope.item ,
									sortfield: "clock",
									sortorder:'DESC',
									 limit: 1
								},
								auth: $scope.auth,
								id: 1
							};				  
							$http.post(url, p,{headers: {'Content-Type': 'application/json'}}).
							then(function(data2, status, headers, config) {
									$scope.average2 = data2.data.result[0].value;
							});
					});
		}
		$scope.cpu_average3 =function(hostid){
			//net.tcp.service
			$scope.average= 0;
			var p1 = $scope.getItems(hostid,'system.cpu.load[percpu,avg15]');
			$http.post(url, p1,{headers: {'Content-Type': 'application/json'}} ).
					then(function(data, status, headers, config) {
						if(data.data.result.length == 0){return ;}
						$scope.item = data.data.result[0].itemid;
						var p ={
								jsonrpc: "2.0",
								method: "history.get",
								params: {
									output: "extend",
									history: 0,
									itemids: $scope.item ,
									sortfield: "clock",
									sortorder:'DESC',
									 limit: 1
								},
								auth: $scope.auth,
								id: 1
							};				  
							$http.post(url, p,{headers: {'Content-Type': 'application/json'}}).
							then(function(data2, status, headers, config) {
									$scope.average3 = data2.data.result[0].value;
							});
					});
		}
		$scope.cpu_top =function(hostid){
		 
							
			var p1 = $scope.getItems(hostid,'cpu.top_processes');
			$scope.top= [];
			$http.post(url, p1,{headers: {'Content-Type': 'application/json'}} ).
					then(function(data, status, headers, config) {
						if(data.data.result.length == 0){return ;}
						$scope.item = data.data.result[0].itemid;
						var p ={
								jsonrpc: "2.0",
								method: "history.get",
								params: {
									output: "extend",
									history: 4,
									itemids: $scope.item ,
									sortfield: "clock",
									sortorder:'DESC',
									limit: 1
								},
								auth: $scope.auth,
								id: 4
							};				  
							$http.post(url, p,{headers: {'Content-Type': 'application/json'}}).
							then(function(data2, status, headers, config) {
								if(data2.data.result.length>0){
									var txt=data2.data.result[0].value;
									// console.log(txt);
									var lines = txt.split("\n");
									// var resulta=[];
									for(var i in lines){
										  var line = lines[i].split(" "); 
										  // line.clean("");
										  var lcase=[]
										  for(var k in line){
												
												if(line[k].trim()!=""){
												     lcase.push(line[k].trim());
												}
										  }
										  // resulta.push(linecase);
										  $scope.top.push( lcase);
										}
								}
							});
					});
		}
		
		$scope.cpu_list =function(hostid){
			var p1 = $scope.getItems(hostid,'system.cpu.load[percpu,avg1]');
			$http.post(url, p1,{headers: {'Content-Type': 'application/json'}} ).
					then(function(data, status, headers, config) {
					  if(data.data.result.length == 0){return ;}
							
						$scope.item = data.data.result[0].itemid;
						var p ={
								jsonrpc: "2.0",
								method: "history.get",
								params: {
									output: "extend",
									history: 0,
									itemids: $scope.item ,
									sortfield: "clock",
									sortorder:'DESC',
									limit: 200
								},
								auth: $scope.auth,
								id: 1
							};				  
							$http.post(url, p,{headers: {'Content-Type': 'application/json'}}).
							then(function(data2, status, headers, config) {
							 
								 $scope.cpu = data2.data.result;	
								$scope.labels = [];
								$scope.pchart = [];
								angular.forEach($scope.cpu, function(value, key) {
								
									$scope.labels.push( new   Date(value.clock * 1000).getHours() +":"+ new Date(value.clock * 1000).getMinutes() );
									$scope.pchart.push( value.value);
									
									var year =new   Date(value.clock * 1000).getFullYear();
									var month =new   Date(value.clock * 1000).getMonth();
									var day =new   Date(value.clock * 1000).getDay();
									$scope.title = "Date: " + year +"/"+ month +"/"+ day;
									 
								});
								 
								  $scope.series = ['CPU'];
								  $scope.data = [
									$scope.pchart
								  ];
								  $scope.onClick = function (points, evt) {
									console.log(points, evt);
								  };
								$scope.options = {
									title: {
											display: true,
											text: $scope.title 
										},
										scales: {
											yAxes: [
												{
													ticks: {
														callback: function(label, index, labels) {
															return parseInt(label*100) +'%';
														}
													},
													scaleLabel: {
														display: true,
														labelString: '100% = 1'
													}
												}
											]
										}
									}
								
							});
						
					});
			
		  }
	  
		$scope.memory_list =function(hostid){
			var p1 = $scope.getItems(hostid,'vm.memory.size[available]');
			$http.post(url, p1,{headers: {'Content-Type': 'application/json'}} ).
					then(function(data, status, headers, config) {
					if(data.data.result.length == 0){return ;}
						$scope.item = data.data.result[0].itemid;
						var p ={
								jsonrpc: "2.0",
								method: "history.get",
								params: {
									output: "extend",
									history: 3,
									itemids: $scope.item ,
									sortfield: "clock",
									sortorder:'DESC',
									limit: 200
								},
								auth: $scope.auth,
								id: 1
							};				  
							$http.post(url, p,{headers: {'Content-Type': 'application/json'}}).
							then(function(data2, status, headers, config) {
								$scope.Memory= [];
								$scope.memo = data2.data.result;	
								$scope.Memory.labels = [];
								$scope.Memory.pchart = [];
								angular.forEach($scope.memo, function(memoitem, key) {
									$scope.Memory.labels.push( new   Date(memoitem.clock * 1000).getHours() +":"+ new Date(memoitem.clock * 1000).getMinutes() );
									$scope.Memory.pchart.push( memoitem.value);
									$scope.title = "Date: " + new   Date(memoitem.clock * 1000).getFullYear() +"/"+ new Date(memoitem.clock * 1000).getMonth() +"/"+ new Date(memoitem.clock * 1000).getDay();
									 
								});								 
								  $scope.Memory.series = ['Memory'];
								  
								  $scope.Memory.data = [
									$scope.Memory.pchart
								  ];
								  // $scope.onClick = function (points, evt) {
									console.log($scope.Memory.pchart);
								  // };
								$scope.Memory.options = {
									title: {
											display: true,
											text: $scope.title 
										},
										scales: {
											yAxes: [
												{
													ticks: {
														callback: function(label, index, labels) {
															return label/1000000000+'GB';
														}
													},
													scaleLabel: {
														display: true,
														labelString: '1GB = 1000000000'
													}
												}
											]
										}
									}
									
								
							});
						
					});
			
		  }

		  $scope.trafic =function(hostid){
			var p1 = $scope.getItems(hostid,'net.if.in[eth0]');
			$http.post(url, p1,{headers: {'Content-Type': 'application/json'}} ).
					then(function(data, status, headers, config) {
					if(data.data.result.length == 0){return ;}
						$scope.item = data.data.result[0].itemid;
						var p ={
								jsonrpc: "2.0",
								method: "history.get",
								params: {
									output: "extend",
									history: 3,
									itemids: $scope.item ,
									sortfield: "clock",
									sortorder:'DESC',
									limit: 200
								},
								auth: $scope.auth,
								id: 1
							};				  
							$http.post(url, p,{headers: {'Content-Type': 'application/json'}}).
							then(function(data2, status, headers, config) {
								$scope.traffic = [];
								$scope.memo = data2.data.result;	
								$scope.traffic.labels = [];
								$scope.traffic.pchart = [];
								angular.forEach($scope.memo, function(memoitem, key) {
									$scope.traffic.labels.push( new   Date(memoitem.clock * 1000).getHours() +":"+ new Date(memoitem.clock * 1000).getMinutes() );
									$scope.traffic.pchart.push( memoitem.value);
									$scope.title = "Date: " + new   Date(memoitem.clock * 1000).getFullYear() +"/"+ new Date(memoitem.clock * 1000).getMonth() +"/"+ new Date(memoitem.clock * 1000).getDay();
									 
								});								 
								  $scope.traffic.series = ['Traffic'];
								  
								  $scope.traffic.data = [
									$scope.traffic.pchart
								  ];
								  // $scope.onClick = function (points, evt) {
									console.log($scope.traffic.pchart);
								  // };
								$scope.traffic.options = {
									title: {
											display: true,
											text: $scope.title 
										},
										scales: {
											yAxes: [
												{
													ticks: {
														callback: function(label, index, labels) {
															return label/1000000000+'GB';
														}
													},
													scaleLabel: {
														display: true,
														labelString: '1GB = 1000000000'
													}
												}
											]
										}
									}
									
								
							});
						
					});
			
		  }
		$scope.disk_list =function(hostid){
			var p1 = $scope.getItems(hostid,'vfs.fs.size[/,free]');
			var p2 = $scope.getItems(hostid,'vfs.fs.size[/,pfree]');
			$http.post(url, p1,{headers: {'Content-Type': 'application/json'}} ).
					then(function(data, status, headers, config) {
					if(data.data.result.length == 0){return ;}
						$scope.item = data.data.result[0].itemid;
						var p ={
								jsonrpc: "2.0",
								method: "history.get",
								params: {
									output: "extend",
									history: 3,
									itemids: $scope.item ,
									sortfield: "clock",
									sortorder:'DESC',
									limit: 3
								},
								auth: $scope.auth,
								id: 1
							};				  
							$http.post(url, p,{headers: {'Content-Type': 'application/json'}}).
							then(function(data2, status, headers, config) {
								console.log(data2.data.result);
							});
						
					});
				$http.post(url, p2,{headers: {'Content-Type': 'application/json'}} ).
					then(function(data, status, headers, config) {
						if(data.data.result.length == 0){return ;}
						$scope.item = data.data.result[0].itemid;
						
						var p ={
								jsonrpc: "2.0",
								method: "history.get",
								params: {
									output: "extend",
									history: 0,
									itemids: $scope.item ,
									sortfield: "clock",
									sortorder:'DESC',
									limit: 1
								},
								auth: $scope.auth,
								id: 1
							};				  
							$http.post(url, p,{headers: {'Content-Type': 'application/json'}}).
							then(function(data2, status, headers, config) {
								$scope.item=data2.data.result[0];
								$scope.disk=[];
								$scope.disk.labels = ["Disk space On", "Disk space free" ];
								$scope.disk.data = [parseFloat($scope.item.value), 100-parseFloat($scope.item.value) ];
								$scope.disk.options = {
								title: {
										  display: true,
										  text: 'Disk Used',
										  position: 'top'
									  } 
								};
								console.log($scope.item);
								
							});
						
					});
	}
	
	$scope.service_history_list =function(hostid){
			var p1 = $scope.getItems(hostid,'vm.memory.size[available]');
			 output=['itemid'],
            filter={'name': service},
			selectHosts=['name', 'host'],
			
			$http.post(url, p1,{headers: {'Content-Type': 'application/json'}} ).
					then(function(data, status, headers, config) {
						if(data.data.result.length == 0){return ;}
						$scope.item = data.data.result[0].itemid;
						var p ={
								jsonrpc: "2.0",
								method: "history.get",
								params: {
									output: "extend",
									history: 3,
									itemids: $scope.item ,
									sortfield: "clock",
									sortorder:'DESC',
									limit: 200
								},
								auth: $scope.auth,
								id: 1
							};				  
							$http.post(url, p,{headers: {'Content-Type': 'application/json'}}).
							then(function(data2, status, headers, config) {
								
								
							});
						
					});
			
		  }
	  
});

  