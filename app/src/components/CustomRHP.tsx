import { useState, useEffect } from 'react';

const ListItem = ({annotation, selectedAnnotationId, annotationManager}) => {
  const [ inEditMode, setInEditMode ] = useState(false);
  const [ editInputValue, setEditInputValue ] = useState(undefined);

  /* Bind editAnnotation to edit button. */
  const editButtonOnClick = (e) => {
    e.stopPropagation();
    if (inEditMode) {
      editAnnotation(annotation);
      /* toggle editMode */
      setInEditMode(false)
    } else {
      /* Default input value */
      if (!editInputValue) {
        setEditInputValue(annotation.bodyValue)
      }
      /* toggle editMode */
      setInEditMode(true)
    }
    
  }

  /* Bind deleteAnnotation to delete button. */
  const deleteButtonOnClick = (e) => {
    e.stopPropagation();
    deleteAnnotation(annotation.id);
  };

  const listItemOnClick = () => {
    annotationManager.selectAnnotation(annotation.id)
          .then(() => {})
          .catch(error => {
              console.log(error);
          });
  }
  const editInputOnChange = e => {
    e.persist();
    setEditInputValue(e.target.value)
  }
  /* Edit an existing annotation using Annotation API and update the list item as well. */
  const editAnnotation = annotation => {
    annotation.bodyValue = editInputValue;
    annotationManager.updateAnnotation(annotation)
        .then(() => {
            console.log("Annotation updated successfully.");
        })
        .catch(error => {
            console.log(error);
        });
  };
  /* Delete an existing annotation from Annotation API (the same will be removed from list as well) */
  const deleteAnnotation = annotationId => {
    const filter = {
        annotationIds: [annotationId]
    };
    annotationManager.deleteAnnotations(filter)
        .then(() => {
            console.log("Annotation deleted successfully.");
        })
        .catch(error => {
            console.log(error);
        });
  };
  return (
    <li
      id={ annotation.id }
      className={ selectedAnnotationId === annotation.id ? "selected" : "unselected" }
      onClick={ listItemOnClick }
    >
      {
        inEditMode ?
          <input type="text" defaultValue={ annotation.bodyValue } onChange={ editInputOnChange }/> :
          <label>{ annotation.bodyValue }</label>
      }
      <button className="edit" onClick={ editButtonOnClick }>{ inEditMode ? "Save" : "Edit" }</button>
      <button className="delete" onClick={ deleteButtonOnClick }>Delete</button>
    </li>
  )
}

const CustomRHP = ({ annotationManager, annotationListItems, setAnnotationListItems }) => {
  // const [ annotationListItems, setAnnotationListItems ] = useState([]);
  const [ selectedAnnotationId, setSelectedAnnotationId ] = useState(undefined);

  const annotationEventListener = event => {
    if (event.type === "ANNOTATION_ADDED") {
        if (event.data.bodyValue) {
            onAnnotationAdded(event.data);
        } else {
            addCommentText(event.data);
        }
    }
    if (event.type === "ANNOTATION_DELETED") {
        onAnnotationDeleted(event.data.id);
    }
    if (event.type === "ANNOTATION_SELECTED") {
        toggleSelectedAnnotation(event.data.id);
    }
    if (event.type === "ANNOTATION_UNSELECTED") {
        toggleSelectedAnnotation();
    }
    if (event.type === "ANNOTATION_UPDATED" && event.data.target.selector.subtype === "freetext") {
        onTextAnnotationUpdated(event.data);
    }
    console.log(event);
  }

  /* This will add a new annotation list item to list maintained in state */
  const onAnnotationAdded = annotation => {
    setAnnotationListItems([...annotationListItems, annotation])
  };
  /* This will delete the annotation list item from list maintained in state */
  const onAnnotationDeleted = id => {
    setAnnotationListItems(annotationListItems.filter(item => item.id !== id))
  }
  /* This will set/unset selected annotation id in state */
  const toggleSelectedAnnotation = id => {
    setSelectedAnnotationId(id)
  }
  /* This will update the text in the annotation list item when text annotation is updated from UI */
  const onTextAnnotationUpdated = annotation => {
    const index = annotationListItems.findIndex(item => item.id === annotation.id);
    annotationListItems[index].bodyValue = annotation.bodyValue;
    setAnnotationListItems(annotationListItems)
  }
  const addCommentText = annotation => {
    const type = annotation.target.selector.subtype;
    const comment = prompt("Enter the text associated with " + type, "Added a " + type) || "Added a " + type;
    annotation.bodyValue = comment;
    annotationManager.updateAnnotation(annotation)
        .then(() => {
            console.log("Annotation updated successfully.");
            onAnnotationAdded(annotation);
        })
        .catch(error => {
            console.log(error);
        });
  }

  useEffect(() => {
    annotationManager.registerEventListener(annotationEventListener);
  }, [])

  return (
    <div className="annotations-container">
        <h3>Annotations</h3>
        <ul id="annotations">
            {
                annotationListItems.map(listItem =>
                    <ListItem
                        key={ listItem.id }
                        annotation={ listItem }
                        selectedAnnotationId={ selectedAnnotationId }
                        annotationManager={ annotationManager }
                    />
                )
            }
        </ul>
    </div>
  )

}
export default CustomRHP;