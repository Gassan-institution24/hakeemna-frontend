import merge from 'lodash/merge';

import { fab } from './components/fab';
import { card } from './components/card';
import { chip } from './components/chip';
import { list } from './components/list';
import { menu } from './components/menu';
import { tabs } from './components/tabs';
import { alert } from './components/alert';
import { badge } from './components/badge';
import { table } from './components/table';
import { paper } from './components/paper';
import { radio } from './components/radio';
import { appBar } from './components/appbar';
import { avatar } from './components/avatar';
import { button } from './components/button';
import { dialog } from './components/dialog';
import { drawer } from './components/drawer';
import { rating } from './components/rating';
import { slider } from './components/slider';
import { select } from './components/select';
import { tooltip } from './components/tooltip';
import { defaultProps } from './default-props';
import { switches } from './components/switch';
import { popover } from './components/popover';
import { stepper } from './components/stepper';
import { svgIcon } from './components/svg-icon';
import { backdrop } from './components/backdrop';
import { checkbox } from './components/checkbox';
import { timeline } from './components/timeline';
import { skeleton } from './components/skeleton';
import { progress } from './components/progress';
import { dataGrid } from './components/data-grid';
import { treeView } from './components/tree-view';
import { accordion } from './components/accordion';
import { textField } from './components/textfield';
import { typography } from './components/typography';
import { pagination } from './components/pagination';
import { datePicker } from './components/date-picker';
import { breadcrumbs } from './components/breadcrumbs';
import { buttonGroup } from './components/button-group';
import { cssBaseline } from './components/css-baseline';
import { autocomplete } from './components/autocomplete';
import { toggleButton } from './components/toggle-button';
import { loadingButton } from './components/loading-button';

// ----------------------------------------------------------------------

export function componentsOverrides(theme) {
  const components = merge(
    defaultProps(theme),
    //
    fab(theme),
    tabs(theme),
    chip(theme),
    card(theme),
    menu(theme),
    list(theme),
    badge(theme),
    table(theme),
    paper(theme),
    alert(theme),
    radio(theme),
    select(theme),
    button(theme),
    rating(theme),
    dialog(theme),
    appBar(theme),
    avatar(theme),
    slider(theme),
    drawer(theme),
    stepper(theme),
    tooltip(theme),
    popover(theme),
    svgIcon(theme),
    switches(theme),
    checkbox(theme),
    dataGrid(theme),
    skeleton(theme),
    timeline(theme),
    treeView(theme),
    backdrop(theme),
    progress(theme),
    textField(theme),
    accordion(theme),
    typography(theme),
    pagination(theme),
    datePicker(theme),
    buttonGroup(theme),
    breadcrumbs(theme),
    cssBaseline(theme),
    autocomplete(theme),
    toggleButton(theme),
    loadingButton(theme)
  );

  return components;
}
