<?php
/**
 * Minisito Concorso Illustramente 2026/2027 – funzioni
 *
 * Da collegare al tema child aggiungendo IN FONDO al suo functions.php:
 *
 *     require_once get_stylesheet_directory() . '/concorso/functions-concorso.php';
 *
 * Cosa fa:
 * 1. registra la posizione di menu "Menu minisito Concorso 2026/2027";
 * 2. carica font, CSS e JS del minisito SOLO sulle pagine che usano il
 *    modello "Minisito Concorso 2026/2027" (il resto del sito non cambia);
 * 3. se non è stato creato un menu, ne mostra uno predefinito.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* 1. Posizione del menu (Aspetto → Menu) */
add_action(
	'after_setup_theme',
	function () {
		register_nav_menu( 'ic-concorso', 'Menu minisito Concorso 2026/2027' );
	}
);

/** La pagina corrente usa il modello del minisito? */
function ic_is_concorso() {
	return is_page_template( 'page-concorso.php' );
}

/** Pagina principale del minisito: la pagina "più in alto" della gerarchia. */
function ic_concorso_root_id() {
	$id        = get_queried_object_id();
	$ancestors = get_post_ancestors( $id );
	return $ancestors ? end( $ancestors ) : $id;
}

/** Indirizzo della cartella "concorso" del tema child (per immagini e file). */
function ic_concorso_uri( $path = '' ) {
	return get_stylesheet_directory_uri() . '/concorso/' . ltrim( $path, '/' );
}

/* 2. Font, CSS e JS solo sulle pagine del minisito */
add_action(
	'wp_enqueue_scripts',
	function () {
		if ( ! ic_is_concorso() ) {
			return;
		}
		$dir = get_stylesheet_directory() . '/concorso';

		// Stessi font della bozza (il sito li carica già da Google Fonts: nessun nuovo servizio esterno).
		wp_enqueue_style(
			'ic-concorso-fonts',
			'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&family=Roboto+Condensed:wght@400;700&display=swap',
			array(),
			null
		);
		wp_enqueue_style( 'ic-concorso', ic_concorso_uri( 'css/style.css' ), array(), filemtime( $dir . '/css/style.css' ) );
		wp_enqueue_script(
			'ic-concorso',
			ic_concorso_uri( 'js/main.js' ),
			array(),
			filemtime( $dir . '/js/main.js' ),
			array(
				'in_footer' => true,
				'strategy'  => 'defer',
			)
		);
	},
	20
);

/* 3. Menu predefinito, usato finché in Aspetto → Menu non si assegna un menu alla posizione */
function ic_concorso_default_menu( $root_id ) {
	$base    = trailingslashit( get_permalink( $root_id ) );
	$current = get_queried_object_id();
	$slug    = get_post_field( 'post_name', $current );

	// classe, indirizzo, testo, pagina (slug figlio oppure 'root')
	$items = array(
		array( 'ic-nav-home', home_url( '/' ), 'Torna alla homepage', '' ),
		array( '', $base, 'Il concorso', 'root' ),
		array( '', $base . 'bando/', 'Il bando 2026/2027', 'bando' ),
		array( '', $base . 'partner/', 'I partner', 'partner' ),
		array( '', $base . 'giurie/', 'Le giurie', 'giurie' ),
		array( 'ic-nav-cta', $base . 'iscriviti/', 'Iscriviti ora!', 'iscriviti' ),
	);

	echo '<ul class="ic-nav-list">';
	foreach ( $items as $item ) {
		list( $class, $url, $label, $key ) = $item;
		$is_current = ( 'root' === $key && $current === $root_id )
			|| ( $key && 'root' !== $key && $current !== $root_id && $key === $slug );
		printf(
			'<li%1$s><a href="%2$s"%3$s>%4$s</a></li>',
			$class ? ' class="' . esc_attr( $class ) . '"' : '',
			esc_url( $url ),
			$is_current ? ' aria-current="page"' : '',
			esc_html( $label )
		);
	}
	echo '</ul>';
}
