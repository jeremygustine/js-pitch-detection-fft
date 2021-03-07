function Grid(_num_items_horiz, _num_items_vert, _grid_w, _grid_h, _startx, _starty){

    if (_num_items_horiz == undefined) _num_items_horiz = 1;
    if (_num_items_vert == undefined) _num_items_vert = 1;
    var _horiz = _num_items_horiz || 1;
    var _vert = _num_items_vert || 1;
  
    this.spacing_x;
    this.spacing_y;
    this.length = 0;
    this.num_items_horiz = 0;
    this.num_items_vert = 0;
  
    this.start = {x: _startx || 0 , y: _starty || 0};
  
    this.grid_w = _grid_w || window.innerWidth;
    this.grid_h = _grid_h || window.innerHeight;
  
    this.x = [];
    this.y = [];
  
    this.add = function(_horiz, _vert) {
  
      this.num_items_horiz += _horiz || 1;
      this.num_items_vert += _vert || 1;
  
      this.spacing_x = this.grid_w / this.num_items_horiz;
      this.spacing_y = this.grid_h / this.num_items_vert;
  
      this.createGrid();
  
      return this;
  
    }

    this.setStart = function(_x, _y) {

        this.start = {x: _x || 0 , y: _y || 0};
        createGrid();

    }

    this.createGrid = function() {

    for (var _y = 0; _y < this.num_items_vert; _y++) {

        for (var _x = 0; _x < this.num_items_horiz; _x++) {

        this.x.push(_x*this.spacing_x+ this.spacing_x/2);
        this.y.push(_y*this.spacing_y+ this.spacing_y/2);

        }
    };
    this.length = this.x.length;
    }

    this.add(_horiz, _vert);

    return this;
}