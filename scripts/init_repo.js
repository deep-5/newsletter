const git = require('isomorphic-git');
const fs = require('fs');
const path = require('path');

async function main() {
  const dir = __dirname;
  console.log('Initializing Git repository in:', dir);
  
  // Init
  await git.init({ fs, dir, defaultBranch: 'main' });
  console.log('Git repo initialized with default branch: main');

  // List of files to add
  const files = [
    'index.html',
    'styles.css',
    'app.js',
    'supabase.js',
    'schema.sql',
    'package.json',
    'server.js',
    'README.md',
    '.gitignore',
    'data/articles.js',
    'assets/logo.jpg',
    'assets/logo.svg'
  ];

  for (const file of files) {
    if (fs.existsSync(path.join(dir, file))) {
      await git.add({ fs, dir, filepath: file });
      console.log('Added:', file);
    }
  }

  // Commit
  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'Deep',
      email: 'deep@aira.newsletter'
    },
    message: 'Initial commit: Complete AIRA Newsletter website with Supabase integration'
  });

  console.log('Committed successfully! Commit SHA:', sha);

  // Add remote origin
  await git.addRemote({
    fs,
    dir,
    remote: 'origin',
    url: 'https://github.com/deep-5/newsletter.git',
    force: true
  });
  console.log('Set remote origin -> https://github.com/deep-5/newsletter.git');
}

main().catch(err => console.error('Error:', err));
