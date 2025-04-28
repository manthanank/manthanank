// GitHub username
const username = 'manthanank';

// DOM Elements
const avatarElement = document.getElementById('avatar');
const nameElement = document.getElementById('name');
const bioElement = document.getElementById('bio');
const followersElement = document.getElementById('followers');
const profileViewsElement = document.getElementById('profile-stars');
const reposCountElement = document.getElementById('repos');
const skillsContainer = document.getElementById('skills-container');
const reposContainer = document.getElementById('repos-container');
const blogContainer = document.getElementById('blog-container');
const codingStatsElement = document.getElementById('coding-stats-pre');
const updateDateElement = document.getElementById('update-date');
const typingTextElement = document.getElementById('typing-text');

// Set current date
updateDateElement.textContent = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

// Typing text effect for the subtitle
const texts = [
  'Software Engineer🎓',
  'Front End Developer🧑‍💻',
  'MEAN Stack Developer🚀',
  'Learn, Code, Build 👽',
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 200;

function typeText() {
  const currentText = texts[textIndex];

  if (isDeleting) {
    typingTextElement.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
    typingDelay = 100;
  } else {
    typingTextElement.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
    typingDelay = 200;
  }

  if (!isDeleting && charIndex === currentText.length) {
    isDeleting = true;
    typingDelay = 1000; // Pause at the end
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % texts.length;
    typingDelay = 500; // Pause before typing next text
  }

  setTimeout(typeText, typingDelay);
}

// Fetch GitHub profile data
async function fetchGitHubProfile() {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) throw new Error('Failed to fetch GitHub profile');

    const data = await response.json();

    // Update profile information
    avatarElement.src = data.avatar_url;
    nameElement.textContent = data.name || username;
    bioElement.textContent = data.bio || 'Software Developer';
    followersElement.textContent = `${data.followers} followers`;
    reposCountElement.textContent = `${data.public_repos} repositories`;
    profileViewsElement.textContent = `${data.public_stars || 0} stars`;

    // Fetch profile stars count
    await fetchProfileViews();

    return data;
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
    nameElement.textContent = 'Manthan Ankolekar';
    bioElement.textContent = 'Software Developer';
    return null;
  }
}

// Fetch profile stars using GitHub API
async function fetchProfileViews() {
  try {
    const starCountElement = document.getElementById('star-count');

    // Skip the traffic API attempt as it requires authentication
    // Go directly to the fallback method using GitHub repository data
    fetch(`https://api.github.com/repos/${username}/${username}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch repo data');
        }
        return response.json();
      })
      .then(data => {
        // Use stars count as a popularity metric
        const starCount = data.stargazers_count || 0;
        starCountElement.textContent = `${starCount.toLocaleString()} stars`;
      })
      .catch(error => {
        console.warn('Unable to fetch GitHub repository data:', error);

        // Final fallback - use localStorage to create a client-side counter
        let starCount = localStorage.getItem('profile_stars') || 0;
        starCount = parseInt(starCount) + 1;
        localStorage.setItem('profile_stars', starCount);
        starCountElement.textContent = `${starCount} stars`;
      });
  } catch (error) {
    console.error('Error setting up profile star counter:', error);
    document.getElementById('star-count').textContent = 'many stars';
  }
}

// Load skills
function loadSkills() {
  const skills = [
    { name: 'HTML', icon: './assets/svg/html.svg' },
    { name: 'CSS', icon: './assets/svg/css.svg' },
    { name: 'SASS', icon: './assets/svg/sass.svg' },
    { name: 'Tailwind', icon: './assets/svg/tailwindcss.svg' },
    { name: 'Bootstrap', icon: './assets/svg/bootstrap.svg' },
    { name: 'JavaScript', icon: './assets/svg/javascript.svg' },
    { name: 'jQuery', icon: './assets/svg/jquery.svg' },
    { name: 'Angular', icon: './assets/svg/angular.svg' },
    { name: 'TypeScript', icon: './assets/svg/typescript.svg' },
    { name: 'RxJS', icon: './assets/svg/rxjs.svg' },
    { name: 'NgRx', icon: './assets/svg/ngrx.svg' },
    { name: 'Python', icon: './assets/svg/python.svg' },
    { name: 'Flask', icon: './assets/svg/flask.svg' },
    { name: 'Node.js', icon: './assets/svg/nodejs.svg' },
    { name: 'Express', icon: './assets/svg/express.svg' },
    { name: 'Socket.IO', icon: './assets/svg/socketio.svg' },
    { name: 'Deno', icon: './assets/svg/deno.svg' },
    { name: 'Gatsby', icon: './assets/svg/gatsby.svg' },
    { name: 'Next.js', icon: './assets/svg/nextjs.svg' },
    { name: 'NestJS', icon: './assets/svg/nestjs.svg' },
    { name: 'Astro', icon: './assets/svg/astro.svg' },
    { name: 'Git', icon: './assets/svg/git.svg' },
    { name: 'GitHub', icon: './assets/svg/github.svg' },
    { name: 'npm', icon: './assets/svg/npm.svg' },
    { name: 'MySQL', icon: './assets/svg/mysql.svg' },
    { name: 'MongoDB', icon: './assets/svg/mongodb.svg' },
    { name: 'Docker', icon: './assets/svg/docker.svg' },
  ];

  skillsContainer.innerHTML = '';
  skills.forEach(skill => {
    const skillElement = document.createElement('div');
    skillElement.className = 'skill-item';
    skillElement.innerHTML = `
      <img src="${skill.icon}" alt="${skill.name}">
      <span class="skill-name">${skill.name}</span>
    `;
    skillsContainer.appendChild(skillElement);
  });
}

// Fetch GitHub repositories
async function fetchRepositories() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=stars&per_page=6`
    );
    if (!response.ok) throw new Error('Failed to fetch repositories');

    const repos = await response.json();
    reposContainer.innerHTML = '';

    repos.forEach(repo => {
      const repoCard = document.createElement('div');
      repoCard.className = 'repo-card';
      repoCard.innerHTML = `
        <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
        <p class="repo-description">${repo.description || 'No description available'}</p>
        <div class="repo-stats">
          <span class="repo-stat"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
          <span class="repo-stat"><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
          <span class="repo-stat"><i class="fas fa-code"></i> ${repo.language || 'Various'}</span>
        </div>
      `;
      reposContainer.appendChild(repoCard);
    });
  } catch (error) {
    console.error('Error fetching repositories:', error);
    reposContainer.innerHTML = '<p>Failed to load repositories. Please check back later.</p>';
  }
}

// Fetch blog posts from Dev.to
async function fetchBlogPosts() {
  try {
    const response = await fetch(`https://dev.to/api/articles?username=${username}&per_page=5`);
    if (!response.ok) throw new Error('Failed to fetch blog posts');

    const posts = await response.json();
    blogContainer.innerHTML = '';

    posts.forEach(post => {
      const date = new Date(post.published_timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      const blogItem = document.createElement('div');
      blogItem.className = 'blog-item';
      blogItem.innerHTML = `
        <a href="${post.url}" target="_blank" class="blog-title">${post.title}</a>
        <p class="blog-date">${date}</p>
        <p>${post.description}</p>
      `;
      blogContainer.appendChild(blogItem);
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    blogContainer.innerHTML = '<p>Failed to load blog posts. Please check back later.</p>';
  }
}

// Fetch coding stats from WakaTime API
async function loadCodingStats() {
  try {
    codingStatsElement.textContent = 'Loading coding stats...';

    // WakaTime API endpoint for last 7 days of coding activity
    // NOTE: This requires authentication. Since we can't expose API keys in client-side code,
    // this should be accessed through a proxy server or pre-generated file

    // Option 1: Using a pre-generated stats file (from GitHub Actions)
    const response = await fetch('./data/wakastats.json');

    if (!response.ok) {
      throw new Error(`Failed to fetch WakaTime stats: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Format the data in a similar way to the placeholder text
    let statsText = '';

    // WakaTime API structure: data.data.languages contains language stats
    if (data.data && data.data.languages && data.data.languages.length > 0) {
      // Sort languages by time spent
      const languages = data.data.languages.sort((a, b) => b.total_seconds - a.total_seconds);

      // Get the top 10 languages
      const topLanguages = languages.slice(0, 10);

      // Generate stats text for each language
      topLanguages.forEach(lang => {
        // Calculate percentage
        const percentage = lang.percent.toFixed(2);

        // Create bar based on percentage (20 characters max)
        const barLength = Math.ceil((lang.percent / 100) * 20);
        const bar = '█'.repeat(barLength) + '░'.repeat(20 - barLength);

        // Format time
        let timeText;
        if (lang.hours > 0) {
          timeText = `${lang.hours} hr${lang.hours !== 1 ? 's' : ''} ${lang.minutes} min${lang.minutes !== 1 ? 's' : ''}`;
        } else {
          timeText = `${lang.minutes} min${lang.minutes !== 1 ? 's' : ''}`;
        }

        // Pad the language name and time for alignment
        const paddedName = lang.name.padEnd(12, ' ');
        const paddedTime = timeText.padEnd(15, ' ');

        // Add to stats text
        statsText += `${paddedName} ${paddedTime} ${bar} ${percentage} %\n`;
      });

      // Add last updated info
      statsText += `\nLast updated: ${new Date(data.data.end).toLocaleDateString()}`;

      // Set the text content
      codingStatsElement.textContent = statsText;
    } else {
      codingStatsElement.textContent = 'No coding stats available. Check back later.';
    }
  } catch (error) {
    console.error('Error fetching WakaTime stats:', error);
    codingStatsElement.textContent =
      'Could not load coding stats. Please check browser console for errors.';
  }
}

// Initialize everything
async function initialize() {
  typeText(); // Start typing animation
  await fetchGitHubProfile();
  loadSkills();
  fetchRepositories();
  fetchBlogPosts();
  loadCodingStats();
}

// Start everything when the page loads
document.addEventListener('DOMContentLoaded', initialize);
