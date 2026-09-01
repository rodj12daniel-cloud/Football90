const teamColorMap = {
  Brazil: ['#009B3A', '#FFDF00', '#002776'],
  Argentina: ['#74ACDF', '#F5F5F5', '#E5B73B'],
  France: ['#1D4ED8', '#F8FAFC', '#D92D2D'],
  England: ['#FFFFFF', '#D52B1E', '#0B1F3A'],
  Germany: ['#121212', '#D22B2B', '#F7C948'],
  Portugal: ['#006600', '#FFCC33', '#D32F2F'],
  Spain: ['#D32F2F', '#FFCC33', '#1D4ED8'],
  Japan: ['#FFFFFF', '#D11F2C', '#1E293B'],
  Mexico: ['#0A7C3C', '#F8FAFC', '#D12F2F'],
  Netherlands: ['#F4A300', '#FFFFFF', '#1F5AA6'],
  'Manchester United': ['#DA291C', '#FFFFFF', '#0C2340'],
  'Manchester City': ['#5CBFEB', '#FFFFFF', '#1F2A44'],
  Liverpool: ['#C8102E', '#FFFFFF', '#0C2340'],
  Arsenal: ['#EF0107', '#FFFFFF', '#DBB24D'],
  Chelsea: ['#034694', '#FFFFFF', '#EDBB00'],
  'Real Madrid': ['#FFFFFF', '#BFBFBF', '#0B1F3A'],
  Barcelona: ['#A50044', '#004D98', '#F0F0F0'],
  'Atlético Madrid': ['#D4001F', '#FFFFFF', '#0D1B2A'],
  Juventus: ['#000000', '#FFFFFF', '#AB8D5A'],
  'AC Milan': ['#D90E44', '#000000', '#F2C94C'],
  'Inter Milan': ['#1B2D5C', '#FFFFFF', '#F9C500'],
  'Bayern Munich': ['#DC052D', '#FFFFFF', '#0C2340'],
  'Borussia Dortmund': ['#FDE100', '#000000', '#000000'],
  PSG: ['#004170', '#D3A241', '#FFFFFF'],
  Default: ['#0D3B2F', '#E5E7EB', '#D4A84D']
};

function createJerseyArt(label, palette = ['#0D3B2F', '#E5E7EB', '#D4A84D']) {
  const safeLabel = String(label || '90')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .slice(0, 8)
    .toUpperCase() || '90';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 900">
      <defs>
        <linearGradient id="base" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${palette[0]}"/>
          <stop offset="55%" stop-color="${palette[1]}"/>
          <stop offset="100%" stop-color="${palette[2]}"/>
        </linearGradient>
      </defs>
      <rect width="800" height="900" fill="#EAEDE9"/>
      <rect x="90" y="70" width="620" height="760" rx="16" fill="url(#base)" opacity="0.96"/>
      <path d="M200 155 L600 155 L660 230 L660 740 Q615 780 550 760 L480 700 L320 700 L250 760 Q185 780 140 740 L140 230 Z" fill="rgba(255,255,255,0.13)"/>
      <circle cx="400" cy="300" r="128" fill="rgba(255,255,255,0.18)"/>
      <path d="M400 210 L472 268 L472 350 L400 390 L328 350 L328 268 Z" fill="rgba(12,18,22,0.15)"/>
      <path d="M300 420 H500 L545 750 H255 Z" fill="rgba(12,18,22,0.14)"/>
      <text x="400" y="450" text-anchor="middle" font-size="64" font-weight="800" fill="#FFFFFF" letter-spacing="8" font-family="Arial, sans-serif">${safeLabel}</text>
      <text x="400" y="670" text-anchor="middle" font-size="22" font-weight="700" fill="rgba(255,255,255,0.92)" letter-spacing="4" font-family="Arial, sans-serif">FOOTBALL 90</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function getTeamPalette(team) {
  const key = String(team || 'Default');
  return teamColorMap[key] || teamColorMap.Default;
}

function teamProductImage(team) {
  return createJerseyArt(team, getTeamPalette(team));
}

const nationalTeamLogos = {
  Argentina: 'assets/images/national-teams/argentina-national-team-logo-footylogos.png',
  Brazil: 'assets/images/national-teams/brazil-national-team-logo-footylogos.png',
  England: 'assets/images/national-teams/england-national-team-logo-footylogos.png',
  France: 'assets/images/national-teams/france-national-team-logo-footylogos.png',
  Germany: 'assets/images/national-teams/germany-national-team-logo-footylogos.png',
  Japan: 'assets/images/national-teams/japan-national-team-logo-footylogos.png',
  Mexico: 'assets/images/national-teams/mexico-national-team-logo-footylogos.png',
  Netherlands: 'assets/images/national-teams/netherlands-national-team-dutch-logo-footylogos.png',
  Portugal: 'assets/images/national-teams/portugal-national-team-logo-footylogos.png',
  Spain: 'assets/images/national-teams/spain-national-team-logo-footylogos.png'
};

function nationalTeamLogo(team) {
  return nationalTeamLogos[team] || '';
}

const BASE_PRODUCTS = [
  { id: 1, name: '2026 Brazil Home Jersey', team: 'Brazil', country: 'Brazil', league: 'International', season: '2026', category: 'World Cup', kitType: 'Home', price: 3499, sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 5, description: 'Official-style Brazil home jersey inspired by the iconic colors of the Seleção.', image: 'assets/images/jerseys/brazil/home-2026/brazil-worldcup-1.jpg', images: ['assets/images/jerseys/brazil/home-2026/brazil-worldcup-1.jpg', 'assets/images/jerseys/brazil/home-2026/brazil-worldcup-2.jpg', 'assets/images/jerseys/brazil/home-2026/brazil-worldcup-3.jpg'], badge: 'World Cup' },
  { id: 2, name: '2026 Argentina Home Jersey', team: 'Argentina', country: 'Argentina', league: 'International', season: '2026', category: 'World Cup', kitType: 'Home', price: 3499, sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 5, description: 'Classic Argentina styling with light blue and gold details for a standout look.', image: 'assets/images/jerseys/argentina/home-2026/argentina1.jpg', images: ['assets/images/jerseys/argentina/home-2026/argentina1.jpg', 'assets/images/jerseys/argentina/home-2026/argentina2.jpg', 'assets/images/jerseys/argentina/home-2026/argentina3.jpg'], badge: 'Best Seller' },
  { id: 3, name: '2026 France Home Jersey', team: 'France', country: 'France', league: 'International', season: '2026', category: 'World Cup', kitType: 'Home', price: 3399, sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.9, description: 'A clean French home jersey with an aggressive, modern fit for serious matchday energy.', image: 'assets/images/jerseys/france/home-2026/france1.jpg', images: ['assets/images/jerseys/france/home-2026/france1.jpg', 'assets/images/jerseys/france/home-2026/france2.jpg', 'assets/images/jerseys/france/home-2026/france3.jpg'], badge: 'New' },
  { id: 4, name: '2026 England Home Jersey', team: 'England', country: 'England', league: 'International', season: '2026', category: 'International', kitType: 'Home', price: 3299, sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.8, description: 'England pride in a premium home jersey built for support all season long.', image: 'assets/images/jerseys/england/home-2026/england1.jpg', images: ['assets/images/jerseys/england/home-2026/england1.jpg', 'assets/images/jerseys/england/home-2026/england2.jpg', 'assets/images/jerseys/england/home-2026/england3.jpg'], badge: 'Limited' },
  { id: 5, name: '2026 Germany Home Jersey', team: 'Germany', country: 'Germany', league: 'International', season: '2026', category: 'International', kitType: 'Home', price: 3299, sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.7, description: 'A bold black and red design that channels the intensity of Die Mannschaft.', image: 'assets/images/jerseys/germany/home-2026/germany1.jpg', images: ['assets/images/jerseys/germany/home-2026/germany1.jpg', 'assets/images/jerseys/germany/home-2026/germany2.jpg', 'assets/images/jerseys/germany/home-2026/germany3.jpg'], badge: 'World Cup' },
  { id: 6, name: '2026 Portugal Home Jersey', team: 'Portugal', country: 'Portugal', league: 'International', season: '2026', category: 'International', kitType: 'Home', price: 3199, sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.8, description: 'Green, gold and red details built for a fearless tournament run and sharp club energy.', image: 'assets/images/jerseys/portugal/home-2026/portugal1.jpg', images: ['assets/images/jerseys/portugal/home-2026/portugal1.jpg', 'assets/images/jerseys/portugal/home-2026/portugal2.jpg', 'assets/images/jerseys/portugal/home-2026/portugal3.jpg'], badge: 'Best Seller' },
  { id: 7, name: '2026 Spain Home Jersey', team: 'Spain', country: 'Spain', league: 'International', season: '2026', category: 'World Cup', kitType: 'Home', price: 3399, sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.9, description: 'A crisp Spanish home shirt with modern tailoring and unmistakable red and gold flair.', image: 'assets/images/jerseys/spain/home-2026/spain1.jpg', images: ['assets/images/jerseys/spain/home-2026/spain1.jpg', 'assets/images/jerseys/spain/home-2026/spain2.jpg', 'assets/images/jerseys/spain/home-2026/spain3.jpg'], badge: 'New' },
  { id: 8, name: '2026 Japan Home Jersey', team: 'Japan', country: 'Japan', league: 'International', season: '2026', category: 'International', kitType: 'Home', price: 3199, sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.8, description: 'A refined Japanese home jersey with a sharp modern silhouette and strong competitive feel.', image: 'assets/images/jerseys/japan/home-2026/japan1.jpg', images: ['assets/images/jerseys/japan/home-2026/japan1.jpg', 'assets/images/jerseys/japan/home-2026/japan2.jpg', 'assets/images/jerseys/japan/home-2026/japan3.jpg'], badge: 'Limited' },
  { id: 9, name: '2026 Mexico Home Jersey', team: 'Mexico', country: 'Mexico', league: 'International', season: '2026', category: 'International', kitType: 'Home', price: 3199, sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.7, description: 'A vibrant green home shirt and icon-inspired detailing for matchday pride.', image: 'assets/images/jerseys/mexico/home-2026/mex1.jpg', images: ['assets/images/jerseys/mexico/home-2026/mex1.jpg', 'assets/images/jerseys/mexico/home-2026/mex2.jpg', 'assets/images/jerseys/mexico/home-2026/mex3.jpg'], badge: 'World Cup' },
  { id: 10, name: '2026 Netherlands Home Jersey', team: 'Netherlands', country: 'Netherlands', league: 'International', season: '2026', category: 'International', kitType: 'Home', price: 3199, sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.8, description: 'Bright orange energy with a premium cut built for confident and expressive football culture.', image: 'assets/images/jerseys/netherlands/home-2026/neth1.jpg', images: ['assets/images/jerseys/netherlands/home-2026/neth1.jpg', 'assets/images/jerseys/netherlands/home-2026/neth2.jpg', 'assets/images/jerseys/netherlands/home-2026/neth3.jpg'], badge: 'New' },
  { id: 11, name: '2026 Manchester United Home Jersey', team: 'Manchester United', country: 'England', league: 'Premier League', season: '2026', category: 'Club', kitType: 'Home', price: 3699, sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.9, description: 'A classic red home jersey with heritage details and a modern performance finish.', image: 'assets/images/jerseys/manchester-united/home-2026/manu1.jpg', images: ['assets/images/jerseys/manchester-united/home-2026/manu1.jpg', 'assets/images/jerseys/manchester-united/home-2026/manu2.jpg', 'assets/images/jerseys/manchester-united/home-2026/manu3.jpg'], badge: 'Best Seller' },
  { id: 12, name: '2026 Manchester City Home Jersey', team: 'Manchester City', country: 'England', league: 'Premier League', season: '2026', category: 'Club', kitType: 'Home', price: 3699, sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.8, description: 'Electric sky blue energy with a sleek premium construction and modern club identity.', image: 'assets/images/jerseys/manchester-city/home-2026/city1.jpg', images: ['assets/images/jerseys/manchester-city/home-2026/city1.jpg', 'assets/images/jerseys/manchester-city/home-2026/city3.jpg'], badge: 'New' },
  { id: 13, name: '2026 Liverpool Home Jersey', team: 'Liverpool', country: 'England', league: 'Premier League', season: '2026', category: 'Club', kitType: 'Home', price: 3699, sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.9, description: 'Deep red club heritage meets a performance-focused football fit designed for matchday impact.', image: 'assets/images/jerseys/liverpool/home-2026/liverpool1.jpg', images: ['assets/images/jerseys/liverpool/home-2026/liverpool1.jpg', 'assets/images/jerseys/liverpool/home-2026/liverpool2.jpg', 'assets/images/jerseys/liverpool/home-2026/liverpool3.jpg'], badge: 'Best Seller' },
  { id: 14, name: '2026 Arsenal Home Jersey', team: 'Arsenal', country: 'England', league: 'Premier League', season: '2026', category: 'Club', kitType: 'Home', price: 3599, sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.8, description: 'A classic red-and-white Arsenal look with sharp details and a clean athletic silhouette.', image: 'assets/images/jerseys/arsenal/home-2026/arsfront.jpg', images: ['assets/images/jerseys/arsenal/home-2026/arsfront.jpg', 'assets/images/jerseys/arsenal/home-2026/ars2.jpg', 'assets/images/jerseys/arsenal/home-2026/ars3.jpg'], badge: 'New' },
  { id: 15, name: '2026 Chelsea Home Jersey', team: 'Chelsea', country: 'England', league: 'Premier League', season: '2026', category: 'Club', kitType: 'Home', price: 3599, sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.7, description: 'Premium blue styling and premium knit comfort for supporters who move with the club.', image: 'assets/images/jerseys/chelsea/home-2026/chels1.jpg', images: ['assets/images/jerseys/chelsea/home-2026/chels1.jpg', 'assets/images/jerseys/chelsea/home-2026/chels2.jpg', 'assets/images/jerseys/chelsea/home-2026/chels3.jpg'], badge: 'Limited' },
  { id: 16, name: '2026 Real Madrid Home Jersey', team: 'Real Madrid', country: 'Spain', league: 'La Liga', season: '2026', category: 'Club', kitType: 'Home', price: 3799, sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 5, description: 'A white iconic home design that radiates the prestige and confidence of Los Blancos.', image: 'assets/images/jerseys/real-madrid/home-2026/madrid1.jpg', images: ['assets/images/jerseys/real-madrid/home-2026/madrid1.jpg', 'assets/images/jerseys/real-madrid/home-2026/madrid2.jpg', 'assets/images/jerseys/real-madrid/home-2026/madrid3.jpg'], badge: 'Best Seller' },
  { id: 17, name: '2026 Barcelona Home Jersey', team: 'Barcelona', country: 'Spain', league: 'La Liga', season: '2026', category: 'Club', kitType: 'Home', price: 3799, sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.9, description: 'A regal navy and red jersey shaped for confident style and club pride.', image: 'assets/images/jerseys/barcelona/home-2026/bar1.jpg', images: ['assets/images/jerseys/barcelona/home-2026/bar1.jpg', 'assets/images/jerseys/barcelona/home-2026/bar2.jpg', 'assets/images/jerseys/barcelona/home-2026/bar3.jpg'], badge: 'New' },
  { id: 18, name: '2026 Atlético Madrid Home Jersey', team: 'Atlético Madrid', country: 'Spain', league: 'La Liga', season: '2026', category: 'Club', kitType: 'Home', price: 3699, sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.8, description: 'Bold red and blue matchday styling with the intensity of a high-pressing side.', image: 'assets/images/jerseys/atletico-madrid/home-2026/atleti-frontpage.jpg', images: ['assets/images/jerseys/atletico-madrid/home-2026/atleti-frontpage.jpg', 'assets/images/jerseys/atletico-madrid/home-2026/atleti-secondpage.jpg', 'assets/images/jerseys/atletico-madrid/home-2026/atleti-thirdpage.jpg'], badge: 'Limited' },
  { id: 19, name: '2026 Juventus Home Jersey', team: 'Juventus', country: 'Italy', league: 'Serie A', season: '2026', category: 'Club', kitType: 'Home', price: 3699, sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.8, description: 'Black-and-white heritage design with premium details and a strong modern finish.', image: 'assets/images/jerseys/juventus/home-2026/juv1.jpg', images: ['assets/images/jerseys/juventus/home-2026/juv1.jpg', 'assets/images/jerseys/juventus/home-2026/juv2.jpg', 'assets/images/jerseys/juventus/home-2026/juv3.jpg'], badge: 'World Cup' },
  { id: 20, name: '2026 AC Milan Home Jersey', team: 'AC Milan', country: 'Italy', league: 'Serie A', season: '2026', category: 'Club', kitType: 'Home', price: 3699, sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.7, description: 'Rich red and black energy elevated with a classic Italian football edge.', image: 'assets/images/jerseys/ac-milan/home-2026/ac1.jpg', images: ['assets/images/jerseys/ac-milan/home-2026/ac1.jpg', 'assets/images/jerseys/ac-milan/home-2026/ac2.jpg', 'assets/images/jerseys/ac-milan/home-2026/ac3.jpg'], badge: 'Best Seller' },
  { id: 21, name: '2026 Inter Milan Home Jersey', team: 'Inter Milan', country: 'Italy', league: 'Serie A', season: '2026', category: 'Club', kitType: 'Home', price: 3699, sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.8, description: 'A modern navy-and-black club look with strong architectural lines and matchday presence.', image: 'assets/images/jerseys/inter-milan/home-2026/interm1.jpg', images: ['assets/images/jerseys/inter-milan/home-2026/interm1.jpg', 'assets/images/jerseys/inter-milan/home-2026/interm2.jpg', 'assets/images/jerseys/inter-milan/home-2026/interm3.jpg'], badge: 'New' },
  { id: 22, name: '2026 Bayern Munich Home Jersey', team: 'Bayern Munich', country: 'Germany', league: 'Bundesliga', season: '2026', category: 'Club', kitType: 'Home', price: 3799, sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.9, description: 'Classic red and dark blue styling for supporters obsessed with dominance and pace.', image: 'assets/images/jerseys/bayern-munich/home-2026/bay1.jpg', images: ['assets/images/jerseys/bayern-munich/home-2026/bay1.jpg', 'assets/images/jerseys/bayern-munich/home-2026/bay2.jpg', 'assets/images/jerseys/bayern-munich/home-2026/bay3.jpg'], badge: 'Best Seller' },
  { id: 23, name: '2026 Borussia Dortmund Home Jersey', team: 'Borussia Dortmund', country: 'Germany', league: 'Bundesliga', season: '2026', category: 'Club', kitType: 'Home', price: 3599, sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.8, description: 'A bright yellow jersey with high-energy style and a fearless identity from the stands to the pitch.', image: 'assets/images/jerseys/borussia-dortmund/home-2026/bor1.jpg', images: ['assets/images/jerseys/borussia-dortmund/home-2026/bor1.jpg', 'assets/images/jerseys/borussia-dortmund/home-2026/bor2.jpg', 'assets/images/jerseys/borussia-dortmund/home-2026/bor3.jpg'], badge: 'Limited' },
  { id: 24, name: '2026 PSG Home Jersey', team: 'PSG', country: 'France', league: 'Ligue 1', season: '2026', category: 'Club', kitType: 'Home', price: 3699, sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.8, description: 'A sharper, premium Parisian home stripe with rich navy tones and gold detail.', image: 'assets/images/jerseys/psg/home-2026/psg-home-2025.jpg', images: ['assets/images/jerseys/psg/home-2026/psg-home-2025.jpg', 'assets/images/jerseys/psg/home-2026/psg-home-2025.2.jpg', 'assets/images/jerseys/psg/home-2026/psg-home-2025.3.jpg'], badge: 'New' }
];

const FOOTBALL90_PRODUCTS = BASE_PRODUCTS.filter((product) => product.season === '2026' && !String(product.image).includes('/2025/') && !String(product.image).includes('/2024/'));


function getProductById(productId) { return FOOTBALL90_PRODUCTS.find((product) => product.id === Number(productId)); }
function getFeaturedProducts() { return FOOTBALL90_PRODUCTS.slice(0, 8); }
function getProductsByCategory(category) { return FOOTBALL90_PRODUCTS.filter((product) => product.category === category); }
function getUniqueTeams() { return [...new Set(FOOTBALL90_PRODUCTS.map((product) => product.team))].sort(); }
function getUniqueCountries() { return [...new Set(FOOTBALL90_PRODUCTS.map((product) => product.country))].sort(); }

window.FOOTBALL90_PRODUCTS = FOOTBALL90_PRODUCTS;
window.getProductById = getProductById;
window.getFeaturedProducts = getFeaturedProducts;
window.getProductsByCategory = getProductsByCategory;
window.getUniqueTeams = getUniqueTeams;
window.getUniqueCountries = getUniqueCountries;
window.teamProductImage = teamProductImage;
window.nationalTeamLogo = nationalTeamLogo;
