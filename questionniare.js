const questions = [
    "I have always dreamed of being a musician or singer",
    "My pet is also one of my best friends - I couldn't bear to be without them.",
    "I like taking photos",
    "I remember facts, figures and formulas easily",
    "I always ask 'Why' rather than 'what' or 'how'",
    "I enjoy scary movies and thrilling rides - I'm a bit of a dare-devil",
    "I enjoy reading, debates and discussions",
    "I would prefer to go to the opera or concert",
    "I would rather go to a party or social gathering than sit at home by myself",
    "At school I really enjoyed biology and natural sciences like geography",
    "At school, I found English and social studies like history easier than maths and science",
    "I'm good at throwing and catching",
    "I like watching science/nature documentaries",
    "I enjoy jigsaw puzzles and other visual puzzles",
    "I have a library of books that I couldn't bear to part with",
    "I like to spend my spare time outdoors doing something",
    "I play a musical instrument",
    "I have lots of pictures and photographs in my house",
    "At school I really enjoyed sciences like astronomy and creation/evolution",
    "I like spending time alone",
    "I am a very social person",
    "My friends think I think too much",
    "I love sport and physical activity",
    "I am good at crosswords, scrabble, and other word puzzles and games",
    "I would rather work alone than as part of a team",
    "I enjoy a wide range of music and can appreciate the different styles/musicians.",
    "I like watching documentaries on the great philosophers and philosophical debates",
    "I'm good at puzzles that require logic such as chess, checkers, and Sudoku",
    "At school I was good at maths and physics (and I enjoyed it)",
    "I think a lot about life and my future",
    "At school I enjoyed geometry and art subjects",
    "I regularly write in a personal diary or journal",
    "I like to know how things work",
    "People think that I crave attention - I seem to like the lime-light",
    "I would rather work as part of a team than on my own",
    "I would rather be outdoors, and preferably out of the city."
];

const questionnaireDiv = document.getElementById('questionnaire');
const progressText = document.querySelector('.progress-text');
const progressBar = document.querySelector('.progress-bar');
const submitButton = document.getElementById('submit-btn');

let answeredCount = 0;
let answers = new Array(36).fill(null);

// Create question containers
questions.forEach((question, index) => {
    const questionContainer = document.createElement('div');
    questionContainer.classList.add('question-container');
    questionContainer.innerHTML = `
        <p>${index + 1}. ${question}</p>
        <div class="options">
            <button type="button" class="option" data-question="${index}" data-value="agree">Agree</button>
            <button type="button" class="option" data-question="${index}" data-value="disagree">Disagree</button>
        </div>
    `;
    questionnaireDiv.appendChild(questionContainer);
});

// Handle option selection and progress update
questionnaireDiv.addEventListener('click', (e) => {
    if (e.target.classList.contains('option')) {
        const button = e.target;
        const questionIndex = button.getAttribute('data-question');
        const questionContainer = button.closest('.question-container');
        const selectedOption = questionContainer.querySelector('.option.selected');

        if (!selectedOption) answeredCount++;
        if (selectedOption === button) answeredCount--;

        questionContainer.querySelectorAll('.option').forEach(btn => btn.classList.remove('selected'));
        if (selectedOption !== button) {
            button.classList.add('selected');
            answers[questionIndex] = button.getAttribute('data-value');
        }

        updateProgress();
    }
});

// Update progress bar and text
function updateProgress() {
    progressText.textContent = `${answeredCount}/36 Questions Answered`;
    progressBar.style.width = `${(answeredCount / 36) * 100}%`;
}

// Handle form submission
submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (answeredCount < 36) {
        alert('Please answer all questions before submitting!');
        return;
    }

    const formData = new URLSearchParams();
    answers.forEach((answer, index) => formData.append(`q${index + 1}`, answer));

    fetch('save_responses.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = `results1.html?job=${encodeURIComponent(data.job)}`;
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
});