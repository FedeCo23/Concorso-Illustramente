<?php
/**
 * Template Name: Minisito Concorso 2026/2027
 * Template Post Type: page
 *
 * Modello di pagina del minisito: al posto di header e footer di Avada usa
 * quelli del minisito (concorso/parts/), con lo stesso markup della bozza HTML.
 * wp_head() e wp_footer() restano: cookie banner (iubenda), statistiche e
 * plugin continuano a funzionare.
 *
 * Il contenuto della pagina (the_content) è quello incollato nell'editor:
 * la parte di ogni file HTML compresa tra "WP: INIZIO" e "WP: FINE".
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>

<body <?php body_class( 'ic' ); ?>>
	<?php wp_body_open(); ?>

	<?php get_template_part( 'concorso/parts/header' ); ?>

	<main id="contenuto" class="ic-main">
		<?php
		while ( have_posts() ) :
			the_post();
			the_content();
		endwhile;
		?>
	</main>

	<?php get_template_part( 'concorso/parts/footer' ); ?>

	<?php wp_footer(); ?>
</body>

</html>
