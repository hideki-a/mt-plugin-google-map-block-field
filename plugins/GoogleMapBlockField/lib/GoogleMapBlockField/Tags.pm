package GoogleMapBlockField::Tags;

use strict;
use warnings;
use GoogleMapBlockField;

sub _hdlr_google_api_key {
    my $plugin = MT->component( 'GoogleMapBlockField' );
    my $value = $plugin->get_config_value( 'google_api_key', 'system' );
    return $value;
}

1;
