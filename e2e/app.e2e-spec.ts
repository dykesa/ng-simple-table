import { TableDevPage } from './app.po';

describe('table-dev App', () => {
  let page: TableDevPage;

  beforeEach(() => {
    page = new TableDevPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
