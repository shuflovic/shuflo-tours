 // DOM elements
        const homeScreen = document.getElementById('home-screen');
        const createQuizScreen = document.getElementById('create-quiz-screen');
        const viewQuizScreen = document.getElementById('view-quiz-screen');
        const messageEl = document.getElementById('message');
        const quizList = document.getElementById('quiz-list');
        const noQuizzesMsg = document.getElementById('no-quizzes-msg');
        const optionsContainer = document.getElementById('options-container');
        const quizOptionsContainer = document.getElementById('quiz-options-container');
        
        // Buttons
        const createQuizBtn = document.getElementById('quizz');
        const addOptionBtn = document.getElementById('add-option');
        const submitQuizBtn = document.getElementById('create-quiz-btn');
        const cancelCreateBtn = document.getElementById('cancel-create');
        const submitVoteBtn = document.getElementById('submit-vote');
        const backToListBtn = document.getElementById('back-to-list');
        
        // Form elements
        const userNameInput = document.getElementById('user-name');
        const quizNameInput = document.getElementById('quiz-name');
        const quizQuestionInput = document.getElementById('quiz-question');
        const voterNameInput = document.getElementById('voter-name');
        
        // Display elements
        const quizTitleEl = document.getElementById('quiz-title');
        const quizQuestionDisplay = document.getElementById('quiz-question-display');
        
        // App state
        let currentQuiz = null;
        let selectedOptionIndex = null;
        let isSubmitting = false;
        
        // Initialize the app
        fetchQuizzes();
        
        // Event listeners
        createQuizBtn.addEventListener('click', showCreateQuizScreen);
        addOptionBtn.addEventListener('click', addOption);
        submitQuizBtn.addEventListener('click', handleCreateQuiz);
        cancelCreateBtn.addEventListener('click', showHomeScreen);
        submitVoteBtn.addEventListener('click', handleVote);
        backToListBtn.addEventListener('click', showHomeScreen);
        
        // Functions
        async function fetchQuizzes() {
            try {
                const { data, error } = await supabaseClient
                    .from('trip_quizzes')
                    .select('*');
                
                if (error) throw error;
                
                // Process each quiz to ensure options is an array
                const processedData = (data || []).map(quiz => {
                    // If options is a string, try to parse it
                    if (typeof quiz.options === 'string') {
                        try {
                            quiz.options = JSON.parse(quiz.options);
                        } catch (e) {
                            console.error("Error parsing options for quiz:", quiz.id, e);
                            quiz.options = [];
                        }
                    }
                    
                    // Ensure options is an array
                    if (!Array.isArray(quiz.options)) {
                        console.warn("Options is not an array for quiz:", quiz.id);
                        quiz.options = [];
                    }
                    
                    return quiz;
                });
                
                renderQuizList(processedData);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
                showMessage('Failed to load quizzes', 'error');
            }
        }
        
        function renderQuizList(quizzes) {
            quizList.innerHTML = '';
            
            if (quizzes.length === 0) {
                noQuizzesMsg.classList.remove('hidden');
                return;
            }
            
            noQuizzesMsg.classList.add('hidden');
            
            quizzes.forEach(quiz => {
                const li = document.createElement('li');
                li.className = 'quiz-item';
                li.innerHTML = `<span class="quiz-title">${quiz.name}</span>`;
                li.addEventListener('click', () => viewQuiz(quiz));
                quizList.appendChild(li);
            });
        }
        
        function addOption() {
            const optionItems = document.querySelectorAll('.option-input');
            const optionCount = optionItems.length;
            
            const optionItem = document.createElement('div');
            optionItem.className = 'option-item';
            optionItem.innerHTML = `
                <input type="text" class="option-input" placeholder="Enter option ${optionCount + 1}">
            `;
            
            optionsContainer.appendChild(optionItem);
        }
        
        async function handleCreateQuiz() {
            if (isSubmitting) return;
            
            const quizName = quizNameInput.value.trim();
            const question = quizQuestionInput.value.trim();
            const userName = userNameInput.value.trim();
            
            if (!quizName) {
                showMessage('Please enter a quiz name', 'error');
                return;
            }
            
            if (!question) {
                showMessage('Please enter a question', 'error');
                return;
            }
            
            const optionInputs = document.querySelectorAll('.option-input');
            const options = Array.from(optionInputs).map(input => input.value.trim());
            const validOptions = options.filter(opt => opt !== '');
            
            if (validOptions.length < 2) {
                showMessage('Please enter at least two options', 'error');
                return;
            }
            
            isSubmitting = true;
            showMessage('', '');
            
            try {
                // Create individual vote counters instead of an array
                // This assumes your table has a votes column as a smallint (single number)
                // And we'll store the current total votes as a single number
                const votes = JSON.stringify(new Array(validOptions.length).fill(0)); // Start with as meny 0 as options
                
                const { data, error } = await supabaseClient
                    .from('trip_quizzes')
                    .insert([
                        {
                            name: quizName,
                            question: question,
                            options: validOptions,
                            votes: votes, // This is now a single integer
                            user_name: userName || 'Anonymous'
                        }
                    ]);
                
                if (error) throw error;
                
                showMessage('Quiz created successfully!', 'success');
                
                // Reset form
                quizNameInput.value = '';
                quizQuestionInput.value = '';
                optionsContainer.innerHTML = `
                    <div class="option-item">
                        <input type="text" class="option-input" placeholder="Enter option 1">
                    </div>
                    <div class="option-item">
                        <input type="text" class="option-input" placeholder="Enter option 2">
                    </div>
                `;
                
                // Show home screen and refresh quizzes
                setTimeout(() => {
                    showHomeScreen();
                    fetchQuizzes();
                }, 1500);
                
            } catch (error) {
                console.error('Error creating quiz:', error);
                showMessage('Failed to create quiz', 'error');
            } finally {
                isSubmitting = false;
            }
        }
        
       function viewQuiz(quiz) {
    currentQuiz = quiz;
    selectedOptionIndex = null;
    
    quizTitleEl.textContent = quiz.name;
    quizQuestionDisplay.textContent = quiz.question;
    voterNameInput.value = userNameInput.value || '';
    
    // Parse options if it's stored as a string
    if (typeof quiz.options === 'string') {
        try {
            quiz.options = JSON.parse(quiz.options);
        } catch (e) {
            console.error("Error parsing options:", e);
            quiz.options = [];
        }
    }
    
    // Ensure options is an array
    if (!Array.isArray(quiz.options)) {
        console.warn("Options is not an array, converting to empty array");
        quiz.options = [];
    }
    
    renderQuizOptions(quiz);
    
    // Show voter input and submit button, hide back button
    document.getElementById('voter-input-container').classList.remove('hidden');
    submitVoteBtn.classList.remove('hidden');
    
    showViewQuizScreen();
}
       let votesArray = [];
        console.log(votesArray);


function renderQuizOptions(quiz) {
    quizOptionsContainer.innerHTML = '';
    
    // Ensure we have a proper votes array
    let voteData = [];
    
    if (typeof quiz.votes === 'string') {
        try {
            voteData = JSON.parse(quiz.votes);
        } catch (e) {
            console.error("Error parsing votes:", e);
            voteData = new Array(quiz.options.length).fill(0);
        }
    } else if (Array.isArray(quiz.votes)) {
        voteData = quiz.votes;
    } else {
        voteData = new Array(quiz.options.length).fill(0);
    }
    
    // Ensure votesArray is updated globally
    votesArray = voteData;
    
    quiz.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option-radio';
        
        const id = `option-${index}`;
        const votes = votesArray[index] || 0;
        
        optionDiv.innerHTML = `
            <input type="radio" id="${id}" name="quiz-option" value="${index}">
            <label for="${id}">${option} <span class="vote-count">(${votes} votes)</span> </label>
        `;
        
        const radioInput = optionDiv.querySelector('input[type="radio"]');
        radioInput.addEventListener('change', () => {
            selectedOptionIndex = index;
        });
        
        quizOptionsContainer.appendChild(optionDiv);
    });
}
        
async function handleVote() {
    if (isSubmitting) return;
    
    const userName = voterNameInput.value.trim();
    
    if (!userName) {
        showMessage('Please enter your name before voting', 'error');
        return;
    }
    
    if (selectedOptionIndex === null) {
        showMessage('Please select an option', 'error');
        return;
    }
    
    isSubmitting = true;
    showMessage('', '');
    
    try {
        // Get current quiz data
        const { data: quizData, error: fetchError } = await supabaseClient
            .from('trip_quizzes')
            .select('votes')
            .eq('id', currentQuiz.id)
            .single();
        
        if (fetchError) throw fetchError;
        
        // Parse votes if necessary
        if (typeof quizData.votes === 'string') {
            votesArray = JSON.parse(quizData.votes || '[]');
        } else if (Array.isArray(quizData.votes)) {
            votesArray = quizData.votes;
        } else {
            votesArray = new Array(currentQuiz.options.length).fill(0);
        }
        
        // Update the selected option's vote count
        votesArray[selectedOptionIndex] = (votesArray[selectedOptionIndex] || 0) + 1;
        
        // Update in the database
        const { error: updateError } = await supabaseClient
            .from('trip_quizzes')
            .update({ votes: votesArray })
            .eq('id', currentQuiz.id);
        
        if (updateError) throw updateError;
        
        showMessage('Vote submitted successfully!', 'success');
        
        // Update current quiz and re-render options
        currentQuiz.votes = votesArray;
        
        // Return to home screen with a delay to show the success message
        setTimeout(() => {
            showHomeScreen();
            fetchQuizzes(); // Refresh the quiz list
        }, 1500);
        
    } catch (error) {
        console.error('Error submitting vote:', error);
        showMessage('Failed to submit vote', 'error');
    } finally {
        isSubmitting = false;
    }
}

// Modify the renderQuizList function to include "See Results" buttons
function renderQuizList(quizzes) {
    quizList.innerHTML = '';
    
    if (quizzes.length === 0) {
        noQuizzesMsg.classList.remove('hidden');
        return;
    }
    
    noQuizzesMsg.classList.add('hidden');
    
    quizzes.forEach(quiz => {
        const li = document.createElement('li');
        li.className = 'quiz-item';
        li.innerHTML = `
            <div class="quiz-row">
                <span class="quiz-title">${quiz.name}</span>
                <div class="quiz-actions">
                    <button class="vote-btn">Vote</button>
                    <button class="results-btn">See Results</button>
                </div>
            </div>
        `;
        
        // Add event listeners for vote and results buttons
        const voteBtn = li.querySelector('.vote-btn');
        voteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the li click event
            viewQuiz(quiz);
        });
        
        const resultsBtn = li.querySelector('.results-btn');
        resultsBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the li click event
            viewResults(quiz);
        });
        
        quizList.appendChild(li);
    });
}

// Add a new function to view results
function viewResults(quiz) {
    currentQuiz = quiz;
    
    quizTitleEl.textContent = quiz.name + " - Results";
quizQuestionDisplay.textContent = quiz.question;
quizQuestionDisplay.style.color = "lightblue"; // Change color
quizQuestionDisplay.style.fontSize = "20px"; // Adjust size
    
    // Parse options and votes if needed
    if (typeof quiz.options === 'string') {
        try {
            quiz.options = JSON.parse(quiz.options);
        } catch (e) {
            quiz.options = [];
        }
    }
    
    let voteData = [];
    if (typeof quiz.votes === 'string') {
        try {
            voteData = JSON.parse(quiz.votes);
        } catch (e) {
            voteData = new Array(quiz.options.length).fill(0);
        }
    } else if (Array.isArray(quiz.votes)) {
        voteData = quiz.votes;
    } else {
        voteData = new Array(quiz.options.length).fill(0);
    }
    
    // Ensure votesArray is updated globally
    votesArray = voteData;
    
    // Render results
    renderQuizResults(quiz);
    
    // Hide voter input and submit button, show only back button
    document.getElementById('voter-input-container').classList.add('hidden');
    submitVoteBtn.classList.add('hidden');
    backToListBtn.classList.remove('hidden');
    
    showViewQuizScreen();
}

// Add a new function to render results with percentages and a visual bar
function renderQuizResults(quiz) {
    quizOptionsContainer.innerHTML = '';
    
    // Calculate total votes
    const totalVotes = votesArray.reduce((sum, count) => sum + (count || 0), 0);
    
    quiz.options.forEach((option, index) => {
        const votes = votesArray[index] || 0;
        const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
        
        const resultDiv = document.createElement('div');
        resultDiv.className = 'result-item';
        resultDiv.innerHTML = `
            <div class="result-label">
                <span class="option-text">${option}</span>
                <span class="vote-stats">${votes} votes (${percentage}%)</span>
            </div>
            <div class="result-bar-container">
                <div class="result-bar" style="width: ${percentage}%"></div>
            </div>
        `;
        
        quizOptionsContainer.appendChild(resultDiv);
    });
    
    // Add total votes info
    const totalDiv = document.createElement('div');
    totalDiv.className = 'total-votes';
    totalDiv.textContent = `Total votes: ${totalVotes}`;
    quizOptionsContainer.appendChild(totalDiv);
}
        
        function showHomeScreen() {
            homeScreen.classList.remove('hidden');
            createQuizScreen.classList.add('hidden');
            viewQuizScreen.classList.add('hidden');
            showMessage('', '');
        }
        
        function showCreateQuizScreen() {
            homeScreen.classList.add('hidden');
            createQuizScreen.classList.remove('hidden');
            viewQuizScreen.classList.add('hidden');
            showMessage('', '');
        }
        
        function showViewQuizScreen() {
            homeScreen.classList.add('hidden');
            createQuizScreen.classList.add('hidden');
            viewQuizScreen.classList.remove('hidden');
            showMessage('', '');
        }
        
        function showMessage(message, type) {
            if (!message) {
                messageEl.classList.add('hidden');
                return;
            }
            
            messageEl.textContent = message;
            messageEl.className = `message ${type}`;
            messageEl.classList.remove('hidden');
        }
    
