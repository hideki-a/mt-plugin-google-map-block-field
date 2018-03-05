; (function ($) {

    // ひとまずheader.jsを基に作成
    var BEF = MT.BlockEditorField;
    var label = trans('googlemap');

    BEF.GoogleMap = function () {
        BEF.apply(this, arguments)
        BEF.GoogleMap.label = 'googlemap';
        BEF.GoogleMap.svg_name = 'ic_map';
    };
    BEF.GoogleMap.create_button = function () {
        return $('<div class="add"><div class="mt-icon--contentblock"><svg title="' + label + '" role="img" class="mt-icon mt-icon--sm"><use xlink:href="' + StaticURI + 'plugins/GoogleMapBlockField/images/sprite.svg#ic_map"></use></svg></div><label>' + label + '</label></div>');
    };
    $.extend(BEF.GoogleMap.prototype, BEF.prototype, {
        options: {},
        map: null,
        marker: null,
        get_id: function () {
            return this.id;
        },
        get_type: function () {
            return 'googlemap';
        },
        get_svg: function() {
            return '<svg title="' + this.get_type() + '" role="img" class="mt-icon mt-icon--sm"><use xlink:href="' + StaticURI + 'plugins/GoogleMapBlockField/images/sprite.svg#' + this.get_svg_name() + '" /></svg>';
        },
        get_svg_name: function() {
            return 'ic_map';
        },
        _mapInit: function ($map, json) {
            const self = this;
            const id = self.id;
            let mappingPoint;

            if (json) {
                mappingPoint = { lat: parseFloat(json["lat"]), lng: parseFloat(json["lng"]) };
            } else {
                mappingPoint = { lat: 35.681167, lng: 139.767052 };
            }

            self.map = new google.maps.Map($map[0], {
                zoom: json ? parseInt(json["zoom"]) : 10,
                center: mappingPoint,
            });
            self.marker = new google.maps.Marker({
                position: mappingPoint,
                map: self.map,
                draggable: true,
            });

            self.marker.addListener('dragend', function() {
                const point = self.marker.getPosition();
                $("#" + id + " input.lat").val(parseFloat(point.lat()));
                $("#" + id + " input.lng").val(parseFloat(point.lng()));
                $("#" + id + " input.zoom").val(parseInt(self.map.zoom));
                self.map.setCenter(self.marker.getPosition());
            });
            self.map.addListener('zoom_changed', function() {
                $("#" + id + " input.zoom").val(parseInt(self.map.zoom));
            });
        },
        _geocoder: function () {
            const self = this;
            const id = self.id;
            const address = $('#' + id + '_address').val();
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status === 'OK') {
                    const point = results[0].geometry.location;
                    self.map.setCenter(point);
                    self.marker.setPosition(point);
                    $("#" + id + " input.lat").val(parseFloat(point.lat()));
                    $("#" + id + " input.lng").val(parseFloat(point.lng()));
                    $("#" + id + " input.zoom").val(self.map.zoom);
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            });
        },
        create: function (id, data) {
            const self = this;
            const $map = $('<div id="map_' + id + '" style="width: 400px; height: 300px;"></div>');
            let json;

            const fieldHTML = [
                '<div class="row no-gutters py-2"><div class="col"></div>',
                '<dl id="' + id + '">',
                '<dt>緯度</dt><dd><input type="text" name="' + id + '_lat" mt:watch-change="1" class="lat" /></dd>',
                '<dt>経度</dt><dd><input type="text" name="' + id + '_lng" mt:watch-change="1" class="lng" /></dd>',
                '<dt>ズームレベル</dt><dd><input type="text" name="' + id + '_zoom" mt:watch-change="1" class="zoom" /></dd>',
                '</dl></div>',
            ];
            self.id = id;
            self.edit_field = $(fieldHTML.join(''));
            self.mapArea = $('<div class="form-group"></div>');
            self.mapArea.append($map);
            self.searchByAddress = $('<div class="form-group"><input type="text" name="' + id + '_address" id="' + id + '_address" class="address" /><input type="button" id="'+ id + '_address_search" value="住所から検索" /></div>');

            if (data["value"]) {
                json = JSON.parse(data["value"]);
                self.edit_field.find("#" + id + " input.lat").val(parseFloat(json["lat"]));
                self.edit_field.find("#" + id + " input.lng").val(parseFloat(json["lng"]));
                self.edit_field.find("#" + id + " input.zoom").val(parseInt(json["zoom"]));
            }

            self.edit_field.find('.col').append(self.mapArea);
            self.edit_field.find('.col').append(self.searchByAddress);

            self._mapInit($map, json);
            $(document).on('click', '#' + id + '_address_search', $.proxy(self._geocoder, self));

            return self.edit_field;
        },
        set_option: function (name, val) {
            const style_name = name.replace('field_option_', '');
            this.options[style_name] = val;
        },
        get_data: function () {
            const self = this;
            const id = self.id;
            const json = {
                'lat': $("#" + id + " input.lat").val(),
                'lng': $("#" + id + " input.lng").val(),
                'zoom': $("#" + id + " input.zoom").val()
            };
            return {
                'value': JSON.stringify(json),
                'html': self.get_html(json),
                'options': self.options,
            }
        },
        get_html: function (json) {
            return "<mt-googlemap>" + JSON.stringify(json) + "</mt-googlemap>";
        }
    });

    MT.BlockEditorFieldManager.register('googlemap', BEF.GoogleMap);

})(jQuery);
