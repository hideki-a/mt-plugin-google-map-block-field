package GoogleMapBlockField;

use strict;
use warnings;

our @EXPORT = qw( plugin translate );
use base qw(Exporter);

sub translate {
    MT->component('GoogleMapBlockField')->translate(@_);
}

sub plugin {
    MT->component('GoogleMapBlockField');
}

1;
