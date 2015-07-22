app.config(function ($stateProvider) {

    // Register our *orders* state.
    $stateProvider.state('orders', {
        url: '/orders',
        controller: 'OrdersController',
        templateUrl: 'js/orders/orders.html'
    });

});

app.controller('OrdersController', function ($scope, OrdersFactory, BlendsFactory){

	$scope.allOrders = null;
	$scope.microName = null;
	$scope.randomMicro = null;
	$scope.recommendedBlend = null;
	$scope.orderIds = [];
	$scope.showRecommendation = false;

	$scope.showOrders = function () {
		OrdersFactory.getAllOrders().then(function (orders) {
			$scope.orderIds = orders.map(function(obj) { return obj._id });
			$scope.orderIds.forEach(function(orderid){

				OrdersFactory.getOrderById(orderid).then(function (order) {
					$scope.order = order;
					BlendsFactory.getBlendById(order.blend[0].typeofblend)
					.then(function (blend) {						
						$scope.microName = blend.micros.map(function(obj){
							return obj.name;
						})

						$scope.randomMicro = $scope.microName[Math.floor(Math.random()*$scope.microName.length)];

						BlendsFactory.getAllBlends().then(function (blends) {
							
							$scope.matchedBlends = blends.filter(function(blend){
								var hasRandomMicro = false;
								blend.micros.forEach(function(micro){
									if(micro.name === $scope.randomMicro){
										hasRandomMicro = true;
									}
								})
								return hasRandomMicro
							}
							);
							
							$scope.recommendedBlend = $scope.matchedBlends[Math.floor(Math.random()*$scope.matchedBlends.length)]
						})
					})
				});
			})
			$scope.orders = orders;
			if(!orders.length) { 
				return $scope.showRecommendation = false;
			}
			$scope.showRecommendation = true;
		});
	};

	$scope.showOrdersById = function (orderid) {
		OrdersFactory.getOrderById(orderid).then(function (order) {
			$scope.orders = order;
		})

	};

	$scope.loadOrderToEdit = function (id) {
		OrdersFactory.getOrderById(id).then(function (order) {
			$scope.editedOrder = order;
		});
	};

	$scope.editOrder = function (id, order) {
		OrdersFactory.editOrderById(id, order.status).then(function (order) {
			$scope.editedOrder = order;
			
		});
	};

	$scope.deleteOrder = function (id) {
		OrdersFactory.deleteOrderById(id)
	  OrdersFactory.getAllOrders().then(function (orders) {
	  	if(!orders.length) {
	  		$scope.orders = orders;
	  		return $scope.showRecommendation = false;
	  	}
	  	$scope.showRecommendation = true;
	  	$scope.orders = orders;
	  })
	};

	$scope.showOrders();
});

