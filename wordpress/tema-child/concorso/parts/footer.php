<?php
/**
 * Footer del minisito (stesso markup della bozza HTML, come il footer di illustramente.it).
 * Le immagini sono nella cartella concorso/assets/img del tema child.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<footer class="ic-footer">
	<div class="ic-footer-top">
		<div class="ic-container ic-footer-cols">

			<div class="ic-footer-col">
				<h2>Segreteria organizzativa di Illustramente</h2>
				<a href="http://www.centroculturaleskene.it/" target="_blank" rel="noopener"
					aria-label="Centro Culturale Skené (si apre in una nuova scheda)">
					<img src="<?php echo esc_url( ic_concorso_uri( 'assets/img/logo-skene.webp' ) ); ?>" alt="Skené" width="78" height="48">
				</a>
			</div>

			<div class="ic-footer-col">
				<h2>Iscriviti al canale</h2>
				<a href="https://www.youtube.com/user/Illustramente" target="_blank" rel="noopener"
					aria-label="Canale YouTube di Illustramente (si apre in una nuova scheda)">
					<img src="<?php echo esc_url( ic_concorso_uri( 'assets/img/logo-youtube.webp' ) ); ?>" alt="YouTube" width="143" height="44">
				</a>
			</div>

			<div class="ic-footer-col ic-footer-policy">
				<a class="ic-pill ic-pill-dark" href="https://www.iubenda.com/privacy-policy/48086239" target="_blank"
					rel="noopener">Privacy Policy</a>
				<a class="ic-pill ic-pill-light" href="https://www.iubenda.com/privacy-policy/48086239/cookie-policy"
					target="_blank" rel="noopener">Cookie Policy</a>
			</div>

		</div>
	</div>

	<div class="ic-footer-bottom-bar">
		<div class="ic-container ic-footer-bottom-inner">
			<p>
				Direttore artistico: Rosanna Maranto<br>
				Copyright © <?php echo esc_html( wp_date( 'Y' ) ); ?> Illustramente | Tutti i diritti riservati<br>
				Coloré Cooperativa Sociale | C/O Cantieri Culturali alla Zisa - Via Paolo Gili, 4 - Palermo<br>
				P. IVA 05899650823<br>
				Foto: <a href="https://www.fotographpalermo.it/" target="_blank" rel="noopener">Fotograph Palermo</a>
			</p>

			<div class="ic-footer-social">
				<a href="https://www.facebook.com/Illustramente/" target="_blank" rel="noopener" aria-label="Facebook">
					<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path d="M14 8V6.5c0-.8.2-1.2 1.3-1.2H17V2.2C16.6 2.15 15.6 2 14.5 2 12 2 10.3 3.5 10.3 6.3V8H7.5v3.5h2.8V22H14V11.5h2.8L17.3 8H14z" />
					</svg>
				</a>
				<a href="https://www.youtube.com/user/Illustramente" target="_blank" rel="noopener" aria-label="YouTube">
					<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z" />
					</svg>
				</a>
				<a href="https://www.instagram.com/illustramente.it/" target="_blank" rel="noopener" aria-label="Instagram">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<rect x="3" y="3" width="18" height="18" rx="5" />
						<circle cx="12" cy="12" r="4" />
						<circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
					</svg>
				</a>
			</div>
		</div>
	</div>
</footer>
