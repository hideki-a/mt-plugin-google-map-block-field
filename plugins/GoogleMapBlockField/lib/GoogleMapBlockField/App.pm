package GoogleMapBlockField::App;

use strict;
use warnings;
use GoogleMapBlockField;

# 参考: https://qiita.com/usualoma/items/0fb8abfc6810f32aa767
# Thanks to @usualoma

sub _insert_before {
    my ( $tmpl, $id, $template_name ) = @_;
    my $after = $tmpl->getElementById($id);
    foreach my $t ( @{ plugin()->load_tmpl( $template_name )->tokens } ) {
        $tmpl->insertBefore( $t, $after );
    }
}

sub _add_js_css {
    my ( $cb, $app, $param, $tmpl ) = @_;
    _insert_before( $tmpl, 'header_include', 'editor.tmpl' );
}

1;
