var ghpages = require('gh-pages');

ghpages.publish(
    'public', // path to public directory
    {
        branch: 'pages',
        repo: 'https://github.com/JJBrindamour/Svelte-Wordle-Clone/tree/pages', // Update to point to your repository  
        user: {
            name: 'JJ', // update to use your name
            email: 'jjbrindamour@gmail.com' // Update to use your email
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)