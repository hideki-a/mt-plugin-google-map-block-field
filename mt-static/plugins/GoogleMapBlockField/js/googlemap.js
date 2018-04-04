; (function ($) {

    // ひとまずheader.jsを基に作成
    var BEF = MT.BlockEditorField;
    BEF.GoogleMap = function () { BEF.apply(this, arguments) };
    $.extend(BEF.GoogleMap, {
        label: trans('GoogleMap'),
        type: 'googlemap',
        create_button: function () {
            return $('<button type="button" class="btn btn-contentblock"><svg title="' + this.label + '" role="img" class="mt-icon"><use xlink:href="' + StaticURI + 'plugins/GoogleMapBlockField/images/sprite.svg#ic_map"></use></svg>' + this.label + '</button>');
        },
    });
    $.extend(BEF.GoogleMap.prototype, BEF.prototype, {
        map: null,
        marker: null,
        get_id: function () {
            return this.id;
        },
        get_type: function () {
            return BEF.GoogleMap.type;
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
                mappingPoint = { lat: parseFloat(json.lat), lng: parseFloat(json.lng) };
            } else {
                mappingPoint = { lat: 35.681167, lng: 139.767052 };
            }

            self.map = new google.maps.Map($map[0], {
                zoom: json ? parseInt(json.zoom) : 10,
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
        create: function (id,data) {
            const self = this;
            self.id = id;
            self.data = data;

            self.view_field = $('<div class="form-group"></div>');
            const $map = $('<div id="map_' + id + '" style="width: 400px; height: 300px;"></div>');
            self.view_field.append($map);

            $(window).one('field_created', function () {
                self._mapInit($map, JSON.parse(self.data.value));
            });

            return self.view_field;
        },
        get_edit_field: function () {
            const self = this;
            let json;
            self.$edit_field = $('<div class="edit_field form-group"></div>');

            const fieldHTML = [
                '<div class="row no-gutters py-2"><div class="col"></div>',
                '<div id="' + this.id + '">',
                '<div class="form-group"><label for="' + this.id + '_lat">緯度</label><input type="text" name="' + this.id + '_lat" id="' + this.id + '_lat" mt:watch-change="1" class="lat form-control" /></div>',
                '<div class="form-group"><label for="' + this.id + '_lng">経度</label><input type="text" name="' + this.id + '_lng" id="' + this.id + '_lng" mt:watch-change="1" class="lng form-control" /></div>',
                '<div class="form-group"><label for="' + this.id + '_zoom">ズームレベル</label><input type="text" name="' + this.id + '_zoom" id="' + this.id + '_zoom" mt:watch-change="1" class="zoom form-control" /></div>',
                '</div>',
            ];
            const $field = $(fieldHTML.join(''));
            const $map = $('<div id="map_' + this.id + '" style="width: 400px; height: 300px;"></div>');
            const $mapArea = $('<div class="form-group"></div>');
            $mapArea.append($map);

            const $searchByAddress = $('<div class="form-group"><label for="' + this.id + '_address">ジオコーディング</label><input type="text" name="' + this.id + '_address" id="' + this.id + '_address" class="address form-control w-50 mb-2" /><input type="button" id="'+ this.id + '_address_search" value="住所から検索" /></div>');

            if (this.data.value) {
                json = JSON.parse(this.data.value);
                $field.find("#" + this.id + " input.lat").val(parseFloat(json.lat));
                $field.find("#" + this.id + " input.lng").val(parseFloat(json.lng));
                $field.find("#" + this.id + " input.zoom").val(parseInt(json.zoom));
            }

            $field.find('.col').append($mapArea);
            $field.find('.col').append($searchByAddress);
            self.$edit_field.append($field);

            self._mapInit($map, json);
            $(document).on('click', '#' + this.id + '_address_search', $.proxy(self._geocoder, self));

            return self.$edit_field;
        },
        save: function(){
            const lat = this.$edit_field.find('input.lat').val();
            const lng = this.$edit_field.find('input.lng').val();
            const zoom = this.$edit_field.find('input.zoom').val();
            const json = {
                'lat': lat,
                'lng': lng,
                'zoom': zoom
            };
            const $map = this.view_field.find('#map_' + this.id);
            this.data.value = JSON.stringify(json);
            this._mapInit($map, json);
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
