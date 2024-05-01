# Epi_BE
##Register a User Endpoint

1.POST /register/
###Description
Registers a new user in the system.

  Request Body
username: The username of the user (string).
password: The password of the user (string).
  Response
200 OK: User created successfully.
400 Bad Request: Invalid user or password too short (less than 6 characters).
500 Internal Server Error: Error creating user.


###User Login Endpoint
2.POST /login/
###Description
Logs in an existing user.

  Request Body
username: The username of the user (string).
password: The password of the user (string).
  Response
200 OK: Successful login. Returns a JWT token.
400 Bad Request: Invalid user or password.
500 Internal Server Error: Error generating JWT token.


###Create a Task Endpoint
3. POST /tasks/
###Description
Creates a new task.

###Authentication
This endpoint requires authentication using a JWT token in the request headers.

  Request Body
title: The title of the task (string).
description: The description of the task (string).
status: The status of the task (string).
assignee_id: The ID of the user to whom the task is assigned (integer).
  Response
200 OK: Task created successfully.
401 Unauthorized: Invalid JWT token.
500 Internal Server Error: Error creating task.


Get All Tasks Endpoint

4.GET /tasks/
  Description
Retrieves all tasks from the database.

  Response
200 OK: Returns an array of tasks.
500 Internal Server Error: Error retrieving tasks.


Get a Task by ID Endpoint
5. GET /tasks/:taskId/
#Description
Retrieves a task by its ID from the database.
  Authentication
This endpoint requires authentication using a JWT token in the request headers.
  Request Parameters
taskId: The ID of the task to retrieve (integer).
  Response
200 OK: Returns the task object.
404 Not Found: Task not found.
500 Internal Server Error: Error retrieving task.


Update a Task Endpoint
6. PUT /tasks/:taskId/
  Description
Updates a task by its ID in the database.

  Authentication
This endpoint requires authentication using a JWT token in the request headers.

  Request Parameters
taskId: The ID of the task to update (integer).
  Request Body
title: The updated title of the task (string).
description: The updated description of the task (string).
status: The updated status of the task (string).
assignee_id: The updated ID of the user to whom the task is assigned (integer).
  Response
200 OK: Task updated successfully.
401 Unauthorized: Invalid JWT token.
404 Not Found: Task not found.
500 Internal Server Error: Error updating task.


Delete a Task Endpoint
7. DELETE /tasks/:taskId/
  Description
Deletes a task by its ID from the database.

  Authentication
This endpoint requires authentication using a JWT token in the request headers.

  Request Parameters
taskId: The ID of the task to delete (integer).
  Response
200 OK: Task deleted successfully.
401 Unauthorized: Invalid JWT token.
404 Not Found: Task not found.
500 Internal Server Error: Error deleting task.
