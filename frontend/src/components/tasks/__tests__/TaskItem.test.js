import { render, screen, fireEvent } from '@testing-library/react';
import { TaskProvider } from '../../../context/TaskContext';
import TaskItem from '../TaskItem';

const mockTask = {
  _id: '1',
  title: 'Test Task',
  description: 'Test Description',
  priority: 'high',
  status: 'pending',
  dueDate: '2025-12-31',
  user: 'user1'
};

const MockTaskProvider = ({ children }) => (
  <TaskProvider>{children}</TaskProvider>
);

describe('TaskItem', () => {
  test('renders task information', () => {
    render(
      <MockTaskProvider>
        <TaskItem task={mockTask} onEdit={() => {}} />
      </MockTaskProvider>
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  test('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    
    render(
      <MockTaskProvider>
        <TaskItem task={mockTask} onEdit={mockOnEdit} />
      </MockTaskProvider>
    );

    fireEvent.click(screen.getByText('Edit'));
    expect(mockOnEdit).toHaveBeenCalled();
  });
});
