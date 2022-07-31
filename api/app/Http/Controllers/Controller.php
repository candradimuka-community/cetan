<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

/**
 * @OA\Info(
 *      version="1.0.0",
 *      x={
 *          "logo": {
 *              "url": "https://via.placeholder.com/190x90.png?text=L5-Swagger"
 *          }
 *      },
 *      title="L5 OpenApi",
 *      description="L5 Swagger OpenApi description",
 *      @OA\Contact(
 *          email="darius@matulionis.lt"
 *      ),
 *     @OA\License(
 *         name="Apache 2.0",
 *         url="https://www.apache.org/licenses/LICENSE-2.0.html"
 *     )
 * )
 * @OA\SecurityScheme(
 *     type="http",
 *     in="header",
 *     scheme="bearer",
 *     securityScheme="bearerAuth",
 *     name="Authorization"
 * )
 * @OA\Get(
 *    path="/",
 *    description="Home Page",
 *    @OA\Response(
 *        response="default",
 *        description="Welcome Page"
 *    )
 * )
 * */
//  * @OA\Get(
//  *    path="/api/user",
//  *    description="Get User Information",
//  *    security={{"bearerAuth":{}}},
//  *    @OA\Response(
//  *        response="200",
//  *        description="User Information"
//  *    ),
//  *    @OA\Response(
//  *        response="401",
//  *        description="User Unregistered"
//  *    ),
//  *    @OA\Response(
//  *        response="500",
//  *        description="Server Error"
//  *    )
//  * )
//  */

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
}
