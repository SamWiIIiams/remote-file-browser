import { render, screen } from '@testing-library/react';
import { Table } from '../components'

test('single item in list', () => {
    const data = [
      {
        name: "testFile",
        type: "file",
        size: 320000,
      },
    ];
    const path = "/"
    render(<Table pathname={path} data={data} />);
    const tableElement = screen.getByTestId('dir-table');
    expect(tableElement).toBeInTheDocument();
})