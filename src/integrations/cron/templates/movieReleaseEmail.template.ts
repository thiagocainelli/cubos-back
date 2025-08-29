import { ReadMoviesDto } from '../../../movies/dtos/readMovies.dto';

export const generateMovieReleaseEmailHTML = (movies: ReadMoviesDto[]): string => {
  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Lançamentos do Dia</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 20px;
        }
        
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .header {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
          color: white;
          text-align: center;
          padding: 40px 20px;
          position: relative;
        }
        
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }
        
        .header h1 {
          font-size: 2.5em;
          font-weight: 700;
          margin-bottom: 10px;
          position: relative;
          z-index: 1;
        }
        
        .header .date {
          font-size: 1.2em;
          opacity: 0.9;
          position: relative;
          z-index: 1;
        }
        
        .content {
          padding: 40px 30px;
        }
        
        .intro {
          text-align: center;
          margin-bottom: 40px;
          color: #666;
          font-size: 1.1em;
        }
        
        .movies-grid {
          display: grid;
          gap: 30px;
          margin-bottom: 40px;
        }
        
        .movie-card {
          background: #f8f9fa;
          border-radius: 15px;
          padding: 25px;
          border-left: 5px solid #ff6b6b;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .movie-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        
        .movie-title {
          font-size: 1.5em;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .movie-title::before {
          content: '🎬';
          font-size: 1.2em;
        }
        
        .movie-poster {
          text-align: center;
          margin: 20px 0;
        }
        
        .movie-poster img {
          max-width: 200px;
          height: auto;
          border-radius: 10px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
          border: 3px solid #fff;
        }
        
        .movie-details {
          background: white;
          padding: 20px;
          border-radius: 10px;
          margin-top: 20px;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        
        .detail-row:last-child {
          border-bottom: none;
        }
        
        .detail-label {
          font-weight: 600;
          color: #666;
        }
        
        .detail-value {
          color: #2c3e50;
        }
        
        .footer {
          background: #2c3e50;
          color: white;
          text-align: center;
          padding: 30px 20px;
        }
        
        .footer h3 {
          margin-bottom: 15px;
          color: #ff6b6b;
        }
        
        .social-links {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 20px;
        }
        
        .social-link {
          color: #bdc3c7;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        
        .social-link:hover {
          color: #ff6b6b;
        }
        
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
          color: white;
          text-decoration: none;
          padding: 15px 30px;
          border-radius: 25px;
          font-weight: 600;
          margin-top: 20px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(255, 107, 107, 0.3);
        }
        
        @media (max-width: 600px) {
          .container {
            margin: 10px;
            border-radius: 15px;
          }
          
          .header {
            padding: 30px 15px;
          }
          
          .header h1 {
            font-size: 2em;
          }
          
          .content {
            padding: 30px 20px;
          }
          
          .movie-card {
            padding: 20px;
          }
          
          .movie-title {
            font-size: 1.3em;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎬 LANÇAMENTOS DO DIA</h1>
          <div class="date">${today}</div>
        </div>
        
        <div class="content">
          <div class="intro">
            <p>🎉 Prepare-se para uma experiência incrível!</p>
            <p>Confira os filmes que estreiam hoje:</p>
          </div>
          
          <div class="movies-grid">
            ${movies
              .map(
                (movie) => `
              <div class="movie-card">
                <div class="movie-title">${movie.title}</div>
                
                ${
                  movie.posterUrl
                    ? `
                  <div class="movie-poster">
                    <img src="${movie.posterUrl}" alt="Poster de ${movie.title}" />
                  </div>
                `
                    : ''
                }
                
                <div class="movie-details">
                  ${
                    movie.genre
                      ? `
                    <div class="detail-row">
                      <span class="detail-label">🎭 Gênero: </span>
                      <span class="detail-value">${movie.genre}</span>
                    </div>
                  `
                      : ''
                  }
                  
                  ${
                    movie.situation
                      ? `
                    <div class="detail-row">
                      <span class="detail-label">📊 Situação: </span>
                      <span class="detail-value">${movie.situation}</span>
                    </div>
                  `
                      : ''
                  }
                  
                  ${
                    movie.releaseDate
                      ? `
                    <div class="detail-row">
                      <span class="detail-label">📅 Data de Lançamento: </span>
                      <span class="detail-value">${new Date(movie.releaseDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                  `
                      : ''
                  }
                  
                  ${
                    movie.ratingPercentage
                      ? `
                    <div class="detail-row">
                      <span class="detail-label">⭐ Avaliação: </span>
                      <span class="detail-value">${movie.ratingPercentage.toFixed(1)}%</span>
                    </div>
                  `
                      : ''
                  }
                  
                </div>
              </div>
            `,
              )
              .join('')}
          </div>
        </div>
        
        <div class="footer">
          <h3>🎭 Cubos Tecnologia - Filmes</h3>
          <p>Fique por dentro dos melhores lançamentos de filmes!</p>
          
          <p style="margin-top: 20px; font-size: 0.9em; opacity: 0.8;">
            © 2025 Cubos Tecnologia. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};
