document.addEventListener('DOMContentLoaded', () => {
  const nationalGrid = document.getElementById('national-team-grid');
  if (!nationalGrid) return;

  const teams = [
    'Brazil', 'Argentina', 'France', 'England', 'Germany', 'Spain', 'Portugal', 'Netherlands', 'Japan', 'Mexico'
  ];

  nationalGrid.innerHTML = teams.map((team) => {
    const product = FOOTBALL90_PRODUCTS.find((item) => item.team === team);
    const logo = nationalTeamLogo(team);
    const destination = product ? `product.html?id=${product.id}` : `shop.html?search=${encodeURIComponent(team)}`;
    return `
      <article class="country-card">
        <a href="${destination}">
          <img class="${logo ? 'national-team-image' : ''}" src="${logo || (product ? product.image : teamProductImage(team))}" alt="${team} logo" />
          <div class="country-body">
            <h4>${team}</h4>
            <span class="shop-link">Shop Now</span>
          </div>
        </a>
      </article>
    `;
  }).join('');
});
