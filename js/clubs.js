document.addEventListener('DOMContentLoaded', () => {
  const clubsGrid = document.getElementById('clubs-grid');
  if (!clubsGrid) return;

  const clubs = [
    { name: 'Manchester United', league: 'Premier League', logo: 'assets/images/teams/manchester-united-logo-footylogos.png' },
    { name: 'Manchester City', league: 'Premier League', logo: 'assets/images/teams/manchester-city-logo-footylogos.png' },
    { name: 'Liverpool', league: 'Premier League', logo: 'assets/images/teams/liverpool-fc-logo-footylogos.png' },
    { name: 'Arsenal', league: 'Premier League', logo: 'assets/images/teams/arsenal-logo-footylogos.png' },
    { name: 'Chelsea', league: 'Premier League', logo: 'assets/images/teams/chelsea-logo-footylogos.png' },
    { name: 'Real Madrid', league: 'La Liga', logo: 'assets/images/teams/real-madrid-logo-footylogos.png' },
    { name: 'Barcelona', league: 'La Liga', logo: 'assets/images/teams/fc-barcelona-logo-footylogos.png' },
    { name: 'Atlético Madrid', league: 'La Liga', logo: 'assets/images/teams/atletico-madrid-logo-footylogos.png' },
    { name: 'Juventus', league: 'Serie A', logo: 'assets/images/teams/juventus-logo-footylogos.png' },
    { name: 'AC Milan', league: 'Serie A', logo: 'assets/images/teams/ac-milan-logo-footylogos.png' },
    { name: 'Inter Milan', league: 'Serie A', logo: 'assets/images/teams/inter-milan-logo-footylogos.png' },
    { name: 'Bayern Munich', league: 'Bundesliga', logo: 'assets/images/teams/bayern-munich-logo-footylogos.png' },
    { name: 'Borussia Dortmund', league: 'Bundesliga', logo: 'assets/images/teams/borussia-dortmund-logo-footylogos.png' },
    { name: 'PSG', league: 'Ligue 1', logo: 'assets/images/teams/paris-saint-germain-psg-logo-footylogos.png' }
  ];

  clubsGrid.innerHTML = clubs.map((club) => {
    const product = FOOTBALL90_PRODUCTS.find((item) => item.team === club.name);
    const destination = product ? `product.html?id=${product.id}` : `shop.html?league=${encodeURIComponent(club.league)}`;

    return `
      <a href="${destination}" class="club-card">
      ${club.logo ? `<img class="club-logo" src="${club.logo}" alt="${club.name} logo" />` : ''}
      <h4>${club.name}</h4>
    </a>
  `;
  }).join('');
});
