document.addEventListener('DOMContentLoaded', function () {
    const review = document.getElementById('submitReview');
    const reviewContainer = document.getElementById('reviewsContainer')
    const textBox = document.getElementById('reviewText')
    loadReviews();

    //use of async function and await learnt by debugging with ChatGPT-5
    async function loadReviews(){
        const response = await fetch("/reviews");
        if(!response.ok){
            alert('Problem with GET request: ' + response.statusText);
            return
        }
        const reviewData = await response.json();
        reviewContainer.innerHTML=''
        reviewData.forEach(review => {
            const reviewDiv = document.createElement('div');

            const stars = document.createElement('strong');
            stars.textContent = '⭐'.repeat(review.rating);

            const comment = document.createElement('p');
            comment.textContent = review.comment;

            const date = document.createElement('small');
            date.textContent = review.date;

            reviewDiv.append(stars, comment, date);
            reviewContainer.appendChild(reviewDiv);
        });
    };

    review.addEventListener('click', ()=>{
        const comment = document.getElementById('reviewText').value;
        const rating = document.getElementById('reviewRating').value;

        if (!rating) {
        alert('Please select a rating');
        return;
        };
        fetch('/reviews', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rating, comment })
        })
            .then(res => res.json())
            .then(data => {
            console.log(data);
            loadReviews();
            alert('Review successful!');
            textBox.textContent = '';
            })
            .catch(err => console.error(err));
    });
});