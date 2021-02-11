export class Menu {
  private _name: string;
  private _link: string;
  private _icon: string;
  private _children: (Menu[] | null);
  private _selected: boolean;
  private _visible: boolean;

  constructor (name: string, link: string, selected: boolean,
    visible: boolean, icon: string, children: (Menu[] | null)) {
    this._name = name
    this._link = link
    this._selected = selected
    this._visible = visible
    this._icon = icon
    this._children = children
  }

  public get name () {
    return this._name
  }

  public set name (name: string) {
    this._name = name
  }

  public get link () {
    return this._link
  }

  public get icon () {
    return this._icon
  }

  public get children () {
    return this._children
  }

  public get selected () {
    return this._selected
  }

  public set selected (selected: boolean) {
    this._selected = selected
  }

  public get visible () {
    return this._visible
  }
}
