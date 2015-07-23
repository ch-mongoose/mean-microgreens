app.directive('review', function(ReviewsFactory, BlendsFactory, AuthService) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/review/review.html',
        scope: {
            review: '=',
            blend: '='
        },
        link: function(scope) {

            scope.creatingReview = {
                rating: null,
                comment: null
            };

            AuthService.getLoggedInUser()
            .then(function (currUser){
                scope.userId = currUser._id;
            });

            scope.showReviews = function () {
              BlendsFactory.getBlendById(scope.blend._id)
              .then(function(blend){
                scope.revArr = blend.reviews;
              });
            };

            scope.showReviews();

            scope.newReview = function(star, comment) {
                var newReview = {
                    rating: star,
                    comment: comment,
                    blend: scope.blend._id,
                    user: scope.userId
                };
                ReviewsFactory.createReview(newReview)
                .then(function(review) {                  
                  scope.blend.reviews = scope.blend.reviews.map(function(review){return review._id;});
                  scope.blend.reviews.push(review._id);
                  BlendsFactory.editBlendById(scope.blend._id, {reviews: scope.blend.reviews});
                })
                .then(function(){
                  scope.showReviews();
                });
                scope.creatingReview.rating = null;
                scope.creatingReview.comment = null;
            };

            
        }
    };
});