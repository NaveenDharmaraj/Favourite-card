
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { Card, Dropdown, Icon } from 'semantic-ui-react';

const SortableItem = SortableElement(({ element, handleOnSortableItemClick, handleOnSortableItemDelete }) =>
    <Card className='DragDesc' as='div' onClick={() => handleOnSortableItemClick(true, element)}>
        <Card.Header>{element.purpose}</Card.Header>
        <div className='moveDeleteWrap'>
            <Icon className='move' />
            <Dropdown className='threeDotBtn' direction='left'>
                <Dropdown.Menu >
                    <Dropdown.Item text='Delete' onClick={(event) => handleOnSortableItemDelete(event, element)} />
                </Dropdown.Menu>
            </Dropdown>
        </div>
        <Card.Content>
            {element.description}
        </Card.Content>
    </Card>
);

const SortableList = SortableContainer(({ addSectionItems, handleOnSortableItemClick, handleOnSortableItemDelete }) => {
    return (
        <div className='about_descCardWrap'>
            {addSectionItems && addSectionItems.map((element, index) => (
                <SortableItem
                    key={`item-${element.id}`}
                    index={index}
                    element={element}
                    handleOnSortableItemClick={handleOnSortableItemClick}
                    handleOnSortableItemDelete={handleOnSortableItemDelete}
                />
            ))}
        </div>
    );
});

SortableContainer.defaultProps = {
    addSectionItems: [],
    handleOnSortableItemClick: () => { },
    handleOnSortableItemClick: () => { },
}
export default SortableList;
