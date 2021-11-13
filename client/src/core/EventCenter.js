var EventCenter = EventCenter || {};
EventCenter.listEventDispatcher = [];

EventCenter.sub = (eventId,listener)=>{
    let event = {
        id: eventId,
        listener: listener
    }
    EventCenter.listEventDispatcher.push(event);
    return event;
}

EventCenter.pub = (eventId, eventData = {})=>{
    let listEvent = EventCenter.listEventDispatcher.filter(e => e.id === eventId);
    listEvent.forEach(e=>e.listener(eventData));
}

EventCenter.remove = (event)=>{
    EventCenter.listEventDispatcher = EventCenter.filter(e=> e !== event);
}

EventCenter.removeById = (eventId) =>{
    EventCenter.listEventDispatcher = EventCenter.filter(e=> e.id !== eventId);
}