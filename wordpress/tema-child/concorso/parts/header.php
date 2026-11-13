<?php
/**
 * Header + menu del minisito (stesso markup della bozza HTML).
 * Il menu si gestisce da Aspetto → Menu, posizione "Menu minisito Concorso 2026/2027".
 * Classi CSS da assegnare alle voci: ic-nav-home (prima voce) e ic-nav-cta (pulsante arancio).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$ic_root = ic_concorso_root_id();
?>
<a class="ic-skip-link" href="#contenuto">Vai al contenuto</a>

<header class="ic-header">
	<div class="ic-container ic-header-inner">
		<a class="ic-brand" href="<?php echo esc_url( get_permalink( $ic_root ) ); ?>">
			<span class="ic-brand-text">Illustramente<small>Concorso 2026/2027</small></span>
		</a>

		<button class="ic-nav-toggle" type="button" aria-expanded="false" aria-controls="ic-nav"
			aria-label="Apri il menu"><span></span></button>

		<nav class="ic-nav" id="ic-nav" aria-label="Menu del concorso">
			<?php
			if ( has_nav_menu( 'ic-concorso' ) ) {
				wp_nav_menu(
					array(
						'theme_location' => 'ic-concorso',
						'container'      => false,
						'menu_class'     => 'ic-nav-list',
						'depth'          => 1,
						'fallback_cb'    => false,
					)
				);
			} else {
				ic_concorso_default_menu( $ic_root );
			}
			?>
		</nav>
	</div>
</header>
